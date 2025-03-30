import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchDoormen } from '../../store/slices/doormanSlice';
import { IDoorman } from '../../services/doorman.service';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { AssignBuildingModal } from '../../components/Doormans/AssignBuildingModal';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const Doormans = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { doormen, loading } = useSelector((state: RootState) => state.doorman);
  const [selectedDoormanId, setSelectedDoormanId] = useState<string | null>(null);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [assignments, setAssignments] = useState<Record<string, boolean>>({});

  useEffect(() => {
    dispatch(fetchDoormen())
      .unwrap()
      .then(async (fetchedDoormen) => {
        console.log('fetchedDoormen:', fetchedDoormen);
        const assignmentMap: Record<string, boolean> = {};
        for (const doorman of fetchedDoormen) {
          assignmentMap[doorman._id] = doorman.buildings && doorman.buildings.length > 0;
        }
        setAssignments(assignmentMap);
      })
      .catch((error: any) => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message || 'Failed to fetch doormen',
        });
      });
  }, [dispatch]);

  const handleAssignBuilding = (doormanId: string) => {
    setSelectedDoormanId(doormanId);
    setAssignModalVisible(true);
  };

  const fetchDoormanData = () => {
    dispatch(fetchDoormen())
      .unwrap()
      .then(async (fetchedDoormen) => {
        console.log('fetchedDoormen:', fetchedDoormen);
        const assignmentMap: Record<string, boolean> = {};
        for (const doorman of fetchedDoormen) {
          assignmentMap[doorman._id] = doorman.buildings && doorman.buildings.length > 0;
        }
        setAssignments(assignmentMap);
      })
      .catch((error: any) => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message || 'Failed to fetch doormen',
        });
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doormen</Text>

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
              <Text>Status</Text>
              <Icon name="chevron-down" size={20} color={colors.gray} />
            </View>
            <View style={styles.filterDropdown}>
              <Text>City</Text>
              <Icon name="chevron-down" size={20} color={colors.gray} />
            </View>
            <TouchableOpacity style={styles.resetButton}>
              <Icon name="refresh" size={18} color="red" />
              <Text style={styles.resetText}>Reset Filter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddDoormanScreen')}
        >
          <Icon name="plus" size={24} color={colors.white} />
          <Text style={styles.addButtonText}>Add New Doorman</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.red} />
      ) : (
        <View style={styles.tableContainer}>
          <ScrollView horizontal={true} style={styles.horizontalScroll}>
            <View>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, styles.idCell]}>ID</Text>
                <Text style={[styles.headerCell, styles.nameCell]}>Full Name</Text>
                <Text style={[styles.headerCell, styles.emailCell]}>Email</Text>
                <Text style={[styles.headerCell, styles.phoneCell]}>Phone</Text>
                <Text style={[styles.headerCell, styles.idNumberCell]}>ID Number</Text>
                <Text style={[styles.headerCell, styles.cityCell]}>City</Text>
                <Text style={[styles.headerCell, styles.statusCell]}>Status</Text>
                <Text style={[styles.headerCell, styles.actionsCell]}>Actions</Text>
              </View>

              {/* Table Content */}
              <ScrollView style={styles.tableContent} contentContainerStyle={styles.tableContentContainer}>
                {doormen.map((doorman: IDoorman, index: number) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.cell, styles.idCell]}>{doorman._id}</Text>
                    <Text style={[styles.cell, styles.nameCell]}>{doorman.fullname}</Text>
                    <Text style={[styles.cell, styles.emailCell]}>{doorman.email}</Text>
                    <Text style={[styles.cell, styles.phoneCell]}>{doorman.phone}</Text>
                    <Text style={[styles.cell, styles.idNumberCell]}>{doorman.idNumber}</Text>
                    <Text style={[styles.cell, styles.cityCell]}>{doorman.city || '-'}</Text>
                    <View style={[styles.statusContainer, doorman.status === 'active' ? styles.activeStatus : styles.inactiveStatus]}>
                      <Text style={styles.statusText}>{doorman.status}</Text>
                    </View>
                    <View style={styles.actionsContainer}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('EditDoormanScreen', { doormanId: doorman._id })}
                      >
                        <Icon name="pencil" size={20} color={colors.gray} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleAssignBuilding(doorman._id)}
                      >
                        <Icon
                          name="office-building"
                          size={20}
                          color={assignments[doorman._id] ? colors.success : colors.gray}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>

          {/* Pagination */}
          <View style={styles.pagination}>
            <Text style={styles.paginationText}>Showing 1-10 of {doormen.length}</Text>
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
      )}

      <AssignBuildingModal
        visible={assignModalVisible}
        onDismiss={() => {
          setAssignModalVisible(false);
          setSelectedDoormanId(null);
        }}
        doormanId={selectedDoormanId || ''}
        onAssignSuccess={fetchDoormanData}
        doorman={doormen.find(d => d._id === selectedDoormanId)}
      />
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
    width: 150,
  },
  nameCell: {
    width: 200,
  },
  emailCell: {
    width: 200,
  },
  phoneCell: {
    width: 120,
  },
  idNumberCell: {
    width: 120,
  },
  cityCell: {
    width: 100,
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
});
