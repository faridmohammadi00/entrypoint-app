import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Modal, Linking, Platform, Share } from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { buildingService } from '../../services/building.service';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';

interface Building {
  _id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  type: 'building' | 'complex' | 'tower';
  userId: string;
  status: 'active' | 'inactive';
  qrCode: {
    uniqueIdentifier: string;
    imageUrl: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const Buildings = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedBuildingForStatus, setSelectedBuildingForStatus] = useState<Building | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      setIsLoading(true);
      const response = await buildingService.getAllBuildings();
      setBuildings(response);
      console.log(response);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : 'Failed to fetch buildings',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBuilding = () => {
    navigation.navigate('CreateBuilding');
  };

  const handleDeleteBuilding = async () => {
    if (!selectedBuildingId) {return;}

    try {
      await buildingService.deleteBuilding(selectedBuildingId);
      setBuildings(buildings.filter(building => building._id !== selectedBuildingId));
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Building deleted successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : 'Failed to delete building',
      });
    } finally {
      setShowDeleteModal(false);
      setSelectedBuildingId(null);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedBuildingForStatus) {return;}

    try {
      if (selectedBuildingForStatus.status === 'active') {
        await buildingService.deactivateBuilding(selectedBuildingForStatus._id);
      } else {
        await buildingService.activateBuilding(selectedBuildingForStatus._id);
      }

      // Update the local state
      setBuildings(buildings.map(building =>
        building._id === selectedBuildingForStatus._id
          ? { ...building, status: building.status === 'active' ? 'inactive' : 'active' }
          : building
      ));

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Building ${selectedBuildingForStatus.status === 'active' ? 'deactivated' : 'activated'} successfully`,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : 'Failed to update building status',
      });
    } finally {
      setShowStatusModal(false);
      setSelectedBuildingForStatus(null);
    }
  };

  const handleDownloadQRCode = async (imageUrl: string, buildingName: string) => {
    try {
      // Check if the imageUrl is base64
      if (imageUrl.startsWith('data:image/png;base64,')) {
        const base64Data = imageUrl.split('base64,')[1];

        if (Platform.OS === 'web') {
          // For web browsers
          const link = document.createElement('a');
          link.href = imageUrl;
          link.download = `${buildingName}_qrcode.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // For mobile devices
          const fileName = `${buildingName}_qrcode.png`;
          const path = Platform.OS === 'ios' 
            ? `${RNFS.DocumentDirectoryPath}/${fileName}`
            : `${RNFS.DownloadDirectoryPath}/${fileName}`;

          // Write the file
          await RNFS.writeFile(path, base64Data, 'base64');

          if (Platform.OS === 'ios') {
            // On iOS, use Share to save or share the file
            await Share.share({
              url: `file://${path}`,
              title: `QR Code for ${buildingName}`,
            });
          } else {
            // On Android, file is already saved to Downloads
            Toast.show({
              type: 'success',
              text1: 'Success',
              text2: 'QR code saved to Downloads folder',
            });
          }
        }
      } else {
        // If it's a regular URL
        await Linking.openURL(imageUrl);
      }
    } catch (error) {
      console.error('Download error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to download QR code',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buildings</Text>

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <View style={styles.filterContent}>
            <View style={styles.filterIcon}>
              <Icon name="filter-variant" size={24} color={colors.gray} />
            </View>
            <View style={styles.filterButton}>
              <Text>Filter By</Text>
            </View>
            <View style={styles.filterDropdown}>
              <Text>Date</Text>
              <Icon name="chevron-down" size={20} color={colors.gray} />
            </View>
            <View style={styles.filterDropdown}>
              <Text>Manager</Text>
              <Icon name="chevron-down" size={20} color={colors.gray} />
            </View>
            <View style={styles.filterDropdown}>
              <Text>Status</Text>
              <Icon name="chevron-down" size={20} color={colors.gray} />
            </View>
            <TouchableOpacity style={styles.resetButton}>
              <Icon name="refresh" size={18} color="red" />
              <Text style={styles.resetText}>Reset Filter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.addButton} onPress={handleAddBuilding}>
          <Icon name="plus" size={24} color={colors.white} />
          <Text style={styles.addButtonText}>Add New Building</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableContainer}>
        <ScrollView horizontal={true} style={styles.horizontalScroll}>
          <View>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.idCell]}>ID</Text>
              <Text style={[styles.headerCell, styles.nameCell]}>Building Name</Text>
              <Text style={[styles.headerCell, styles.typeCell]}>Type</Text>
              <Text style={[styles.headerCell, styles.addressCell]}>Address</Text>
              <Text style={[styles.headerCell, styles.cityCell]}>City</Text>
              <Text style={[styles.headerCell, styles.statusCell]}>Status</Text>
              <Text style={[styles.headerCell, styles.actionsCell]}>Action</Text>
            </View>

            {/* Table Content */}
            <ScrollView style={styles.tableContent} contentContainerStyle={styles.tableContentContainer}>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.red} />
                </View>
              ) : (
                buildings.map((building) => (
                  <View key={building._id} style={styles.tableRow}>
                    <Text style={[styles.cell, styles.idCell]}>{building._id.slice(-6)}</Text>
                    <Text style={[styles.cell, styles.nameCell]}>{building.name}</Text>
                    <Text style={[styles.cell, styles.typeCell]}>{building.type}</Text>
                    <Text style={[styles.cell, styles.addressCell]}>{building.address}</Text>
                    <Text style={[styles.cell, styles.cityCell]}>{building.city}</Text>
                    <View style={[
                      styles.statusContainer,
                      building.status === 'active' ? styles.activeStatus : styles.inactiveStatus,
                    ]}>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedBuildingForStatus(building);
                          setShowStatusModal(true);
                        }}
                        style={styles.statusButton}
                      >
                        <Text style={styles.statusText}>
                          {building.status.charAt(0).toUpperCase() + building.status.slice(1)}
                        </Text>
                        <Icon name="chevron-down" size={16} color="#2D3748" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.actionsContainer}>
                      <TouchableOpacity style={styles.actionButton}>
                        <Icon name="view-grid" size={20} color={colors.gray} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <Icon name="map-marker" size={20} color={colors.gray} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDownloadQRCode(building.qrCode.imageUrl, building.name)}
                      >
                        <Icon name="download" size={20} color={colors.gray} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {
                          setSelectedBuildingId(building._id);
                          setShowDeleteModal(true);
                        }}
                      >
                        <Icon name="delete" size={20} color={colors.gray} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </ScrollView>

        {/* Pagination */}
        <View style={styles.pagination}>
          <Text style={styles.paginationText}>Showing 1-10 of 78</Text>
          <View style={styles.paginationControls}>
            <TouchableOpacity style={styles.pageButton}>
              <Icon name="chevron-left" size={20} color={colors.gray} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.pageButton}>
              <Icon name="chevron-right" size={20} color={colors.gray} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Add Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Deletion</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete this building?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowDeleteModal(false);
                  setSelectedBuildingId(null);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDeleteBuilding}
              >
                <Text style={[styles.modalButtonText, styles.deleteButtonText]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Status Change Confirmation Modal */}
      <Modal
        visible={showStatusModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Status Change</Text>
            <Text style={styles.modalText}>
              Are you sure you want to {selectedBuildingForStatus?.status === 'active' ? 'deactivate' : 'activate'} this building?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowStatusModal(false);
                  setSelectedBuildingForStatus(null);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleStatusChange}
              >
                <Text style={[styles.modalButtonText, styles.confirmButtonText]}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterScroll: {
    flex: 1,
  },
  filterContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterIcon: {
    padding: 8,
    marginRight: 8,
  },
  filterButton: {
    padding: 8,
    marginRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#E5E5E5',
  },
  filterDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginRight: 8,
  },
  resetButton: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resetText: {
    color: colors.red,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    marginLeft: 16,
    gap: 8,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '500',
  },
  tableContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  horizontalScroll: {
    maxHeight: 500,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#2D3748',
  },
  tableContent: {
    backgroundColor: colors.white,
  },
  tableContentContainer: {
    paddingBottom: 16,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    alignItems: 'center',
  },
  cell: {
    color: '#2D3748',
  },
  idCell: {
    width: 100,
  },
  nameCell: {
    width: 200,
  },
  typeCell: {
    width: 120,
  },
  addressCell: {
    width: 300,
  },
  cityCell: {
    width: 150,
  },
  statusCell: {
    width: 100,
  },
  actionsCell: {
    width: 200,
  },
  statusContainer: {
    width: 100,
    padding: 4,
    borderRadius: 16,
    alignItems: 'center',
  },
  activeStatus: {
    backgroundColor: '#E8FFF3',
  },
  inactiveStatus: {
    backgroundColor: '#FFE8E8',
  },
  statusText: {
    color: '#2D3748',
    fontSize: 12,
  },
  actionsContainer: {
    width: 200,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  paginationText: {
    color: '#718096',
  },
  paginationControls: {
    flexDirection: 'row',
    gap: 8,
  },
  pageButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 4,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  deleteButton: {
    backgroundColor: colors.red,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  deleteButtonText: {
    color: colors.white,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: '100%',
    paddingVertical: 4,
  },
  confirmButton: {
    backgroundColor: colors.red,
  },
  confirmButtonText: {
    color: colors.white,
  },
});
