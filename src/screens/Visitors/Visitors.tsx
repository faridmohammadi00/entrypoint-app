import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { visitorService } from '../../services/visitor.service';
import Toast from 'react-native-toast-message';

interface Visitor {
  _id: string;
  fullname: string;
  id_number: string;
  birthday: Date;
  gender: 'male' | 'female' | 'other';
  region: string;
  expire_date: Date;
  phone: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export const Visitors = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedVisitorForStatus, setSelectedVisitorForStatus] = useState<Visitor | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      setIsLoading(true);
      const response = await visitorService.getAllVisitors();
      setVisitors(response);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : 'Failed to fetch visitors',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVisitor = async () => {
    if (!selectedVisitorId) {return;}

    try {
      await visitorService.deleteVisitor(selectedVisitorId);
      setVisitors(visitors.filter(visitor => visitor._id !== selectedVisitorId));
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Visitor deleted successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : 'Failed to delete visitor',
      });
    } finally {
      setShowDeleteModal(false);
      setSelectedVisitorId(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Visitors</Text>

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
              <Text>Gender</Text>
              <Icon name="chevron-down" size={20} color={colors.gray} />
            </View>
            <View style={styles.filterDropdown}>
              <Text>Region</Text>
              <Icon name="chevron-down" size={20} color={colors.gray} />
            </View>
            <TouchableOpacity style={styles.resetButton}>
              <Icon name="refresh" size={18} color="red" />
              <Text style={styles.resetText}>Reset Filter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateVisitor')}>
          <Icon name="plus" size={24} color={colors.white} />
          <Text style={styles.addButtonText}>Add New Visitor</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableContainer}>
        <ScrollView horizontal={true} style={styles.horizontalScroll}>
          <View>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.idCell]}>ID</Text>
              <Text style={[styles.headerCell, styles.nameCell]}>Full Name</Text>
              <Text style={[styles.headerCell, styles.dateCell]}>Birthdate</Text>
              <Text style={[styles.headerCell, styles.dateCell]}>First Visit</Text>
              <Text style={[styles.headerCell, styles.dateCell]}>Last Visit</Text>
              <Text style={[styles.headerCell, styles.smallCell]}>Gender</Text>
              <Text style={[styles.headerCell, styles.smallCell]}>Region</Text>
              <Text style={[styles.headerCell, styles.statusCell]}>Status</Text>
              <Text style={[styles.headerCell, styles.actionsCell]}>Actions</Text>
            </View>

            {/* Table Content */}
            <ScrollView style={styles.tableContent} contentContainerStyle={styles.tableContentContainer}>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.red} />
                </View>
              ) : (
                visitors.map((visitor) => (
                  <View key={visitor._id} style={styles.tableRow}>
                    <Text style={[styles.cell, styles.idCell]}>{visitor.id_number}</Text>
                    <Text style={[styles.cell, styles.nameCell]}>{visitor.fullname}</Text>
                    <Text style={[styles.cell, styles.dateCell]}>{new Date(visitor.birthday).toLocaleDateString()}</Text>
                    <Text style={[styles.cell, styles.dateCell]}>{visitor.createdAt ? new Date(visitor.createdAt).toLocaleDateString() : '-'}</Text>
                    <Text style={[styles.cell, styles.dateCell]}>{new Date(visitor.expire_date).toLocaleDateString()}</Text>
                    <Text style={[styles.cell, styles.smallCell]}>{visitor.gender}</Text>
                    <Text style={[styles.cell, styles.smallCell]}>{visitor.region}</Text>
                    <View style={[styles.statusContainer, visitor.status === 'active' ? styles.activeStatus : styles.inactiveStatus]}>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedVisitorForStatus(visitor);
                          setShowStatusModal(true);
                        }}
                        style={styles.statusButton}
                      >
                        <Text style={styles.statusText}>
                          {visitor.status.charAt(0).toUpperCase() + visitor.status.slice(1)}
                        </Text>
                        <Icon name="chevron-down" size={16} color="#2D3748" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.actionsContainer}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('EditVisitor', { visitorId: visitor._id })}
                      >
                        <Icon name="pencil" size={20} color={colors.gray} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {
                          setSelectedVisitorId(visitor._id);
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

      {/* Delete Confirmation Modal */}
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
              Are you sure you want to delete this visitor?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowDeleteModal(false);
                  setSelectedVisitorId(null);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDeleteVisitor}
              >
                <Text style={[styles.modalButtonText, styles.deleteButtonText]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Status Change Modal */}
      <Modal
        visible={showStatusModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Status</Text>
            <Text style={styles.modalText}>
              Change status for {selectedVisitorForStatus?.fullname}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowStatusModal(false);
                  setSelectedVisitorForStatus(null);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={() => {
                  if (selectedVisitorForStatus) {
                    const newStatus = selectedVisitorForStatus.status === 'active' ? 'inactive' : 'active';
                    visitorService.updateVisitor(selectedVisitorForStatus._id, { status: newStatus })
                      .then(() => {
                        setVisitors(visitors.map(v =>
                          v._id === selectedVisitorForStatus._id
                            ? { ...v, status: newStatus }
                            : v
                        ));
                        Toast.show({
                          type: 'success',
                          text1: 'Success',
                          text2: 'Status updated successfully',
                        });
                      })
                      .catch(error => {
                        Toast.show({
                          type: 'error',
                          text1: 'Error',
                          text2: error instanceof Error ? error.message : 'Failed to update status',
                        });
                      });
                  }
                  setShowStatusModal(false);
                  setSelectedVisitorForStatus(null);
                }}
              >
                <Text style={[styles.modalButtonText, styles.submitButtonText]}>
                  {selectedVisitorForStatus?.status === 'active' ? 'Deactivate' : 'Activate'}
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
    gap: 4,
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
    width: 200,
  },
  nameCell: {
    width: 200,
  },
  dateCell: {
    width: 120,
  },
  smallCell: {
    width: 80,
  },
  statusCell: {
    width: 100,
  },
  actionsCell: {
    width: 100,
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
    width: 100,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalText: {
    color: '#2D3748',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  modalButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 4,
  },
  cancelButton: {
    backgroundColor: colors.white,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: colors.red,
    borderRadius: 10,
  },
  modalButtonText: {
    color: colors.red,
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: colors.white,
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
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: '100%',
    paddingVertical: 4,
  },
  submitButton: {
    backgroundColor: colors.red,
    borderRadius: 10,
  },
  submitButtonText: {
    color: colors.white,
  },
});
