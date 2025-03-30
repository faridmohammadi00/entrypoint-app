import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { visitService } from '../../services/visit.service';
import Toast from 'react-native-toast-message';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type VisitStatus = 'pending' | 'completed' | 'cancelled';

interface Visit {
  _id: string;
  visitor_id: {
    _id: string;
    fullname: string;
    id_number: string;
  };
  building_id: {
    _id: string;
    name: string;
    address: string;
  };
  user_id: {
    _id: string;
    fullname: string;
    email: string;
  };
  check_in_date: string;
  check_out_date: string | null;
  unit: string;
  purpose: string;
  status: VisitStatus;
  createdAt: string;
  updatedAt?: string;
}

interface FilterState {
  date: Date | null;
  status: VisitStatus | '';
  building: string;
}

interface VisitResponse {
  _id: string;
  visitor_id: {
    _id: string;
    fullname: string;
    id_number: string;
  };
  building_id: {
    _id: string;
    name: string;
    address: string;
  };
  user_id: {
    _id: string;
    fullname: string;
    email: string;
  };
  check_in_date: string;
  check_out_date: string | Date | null;
  unit: string;
  purpose: string;
  status: VisitStatus;
  createdAt: string;
  updatedAt?: string;
}

export const VisitsReport = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [filteredVisits, setFilteredVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    date: null,
    status: '',
    building: '',
  });
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'VisitsReport'>>();

  const applyFilters = useCallback(() => {
    let filtered = visits;

    // Apply date filter
    if (filters.date) {
      const filterDate = new Date(filters.date);
      filterDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(filterDate);
      nextDay.setDate(nextDay.getDate() + 1);

      filtered = filtered.filter(visit => {
        const visitDate = new Date(visit.check_in_date);
        return visitDate >= filterDate && visitDate < nextDay;
      });
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(visit => visit.status === filters.status);
    }

    // Apply building filter
    if (filters.building) {
      filtered = filtered.filter(visit => visit.building_id._id === filters.building);
    }

    setFilteredVisits(filtered);
  }, [filters, visits]);

  useEffect(() => {
    fetchVisits();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, visits, applyFilters]);

  useEffect(() => {
    if (route.params?.refresh) {
      fetchVisits();
      navigation.setParams({ refresh: undefined });
    }
  }, [route.params?.refresh, navigation]);

  const fetchVisits = async () => {
    try {
      setIsLoading(true);
      const response = await visitService.getAllVisits() as VisitResponse[];
      console.log(response);
      const formattedVisits = response.map(visit => ({
        ...visit,
        check_out_date: visit.check_out_date ? new Date(visit.check_out_date).toISOString() : null,
      }));
      setVisits(formattedVisits);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : 'Failed to fetch visits',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: 'completed' | 'cancelled') => {
    if (!selectedVisit) {return;}

    try {
      const checkOutDate = new Date();
      await visitService.updateVisit(selectedVisit._id, {
        status: newStatus,
        check_out_date: newStatus === 'completed' ? checkOutDate : undefined,
      });

      setVisits(visits.map(v =>
        v._id === selectedVisit._id
          ? { ...v, status: newStatus, check_out_date: newStatus === 'completed' ? checkOutDate.toISOString() : v.check_out_date }
          : v
      ));

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Visit ${newStatus} successfully`,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : 'Failed to update visit status',
      });
    } finally {
      setShowStatusModal(false);
      setSelectedVisit(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Visits Report</Text>

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
              <Text>Status</Text>
              <Icon name="chevron-down" size={20} color={colors.gray} />
            </View>
            <View style={styles.filterDropdown}>
              <Text>Building</Text>
              <Icon name="chevron-down" size={20} color={colors.gray} />
            </View>
            <TouchableOpacity style={styles.resetButton} onPress={() => setFilters({
              date: null,
              status: '',
              building: '',
            })}>
              <Icon name="refresh" size={18} color="red" />
              <Text style={styles.resetText}>Reset Filter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateVisit')}>
          <Icon name="plus" size={24} color={colors.white} />
          <Text style={styles.addButtonText}>New Visit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableContainer}>
        <ScrollView horizontal={true} style={styles.horizontalScroll}>
          <View>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.idCell]}>ID</Text>
              <Text style={[styles.headerCell, styles.nameCell]}>Visitor</Text>
              <Text style={[styles.headerCell, styles.dateCell]}>Check In</Text>
              <Text style={[styles.headerCell, styles.dateCell]}>Check Out</Text>
              <Text style={[styles.headerCell, styles.smallCell]}>Unit</Text>
              <Text style={[styles.headerCell, styles.smallCell]}>Purpose</Text>
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
                filteredVisits.map((visit) => (
                  <View key={visit._id} style={styles.tableRow}>
                    <Text style={[styles.cell, styles.idCell]}>{visit._id.slice(-6)}</Text>
                    <Text style={[styles.cell, styles.nameCell]}>{visit.visitor_id.fullname}</Text>
                    <Text style={[styles.cell, styles.dateCell]}>{new Date(visit.check_in_date).toLocaleString()}</Text>
                    <Text style={[styles.cell, styles.dateCell]}>{visit.check_out_date ? new Date(visit.check_out_date).toLocaleString() : '-'}</Text>
                    <Text style={[styles.cell, styles.smallCell]}>{visit.unit}</Text>
                    <Text style={[styles.cell, styles.smallCell]}>{visit.purpose}</Text>
                    <View style={[
                      styles.statusContainer,
                      visit.status === 'completed' ? styles.completedStatus :
                      visit.status === 'cancelled' ? styles.cancelledStatus :
                      styles.pendingStatus,
                    ]}>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedVisit(visit);
                          setShowStatusModal(true);
                        }}
                        style={styles.statusButton}
                      >
                        <Text style={styles.statusText}>
                          {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                        </Text>
                        <Icon name="chevron-down" size={16} color="#2D3748" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.actionsContainer}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('EditVisit', { visitId: visit._id })}
                      >
                        <Icon name="pencil" size={20} color={colors.gray} />
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
          <Text style={styles.paginationText}>Showing 1-{filteredVisits.length} of {filteredVisits.length}</Text>
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
              Change status for visit {selectedVisit?._id.slice(-6)}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowStatusModal(false);
                  setSelectedVisit(null);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              {selectedVisit?.status === 'pending' && (
                <>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.completeButton]}
                    onPress={() => handleStatusChange('completed')}
                  >
                    <Text style={[styles.modalButtonText, styles.completeButtonText]}>
                      Complete
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => handleStatusChange('cancelled')}
                  >
                    <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </>
              )}
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
    width: 100,
  },
  nameCell: {
    width: 150,
  },
  dateCell: {
    width: 150,
  },
  smallCell: {
    width: 100,
  },
  statusCell: {
    width: 100,
  },
  actionsCell: {
    width: 80,
  },
  statusContainer: {
    width: 100,
    padding: 4,
    borderRadius: 16,
    alignItems: 'center',
  },
  pendingStatus: {
    backgroundColor: '#FFF3E8',
  },
  completedStatus: {
    backgroundColor: '#E8FFF3',
  },
  cancelledStatus: {
    backgroundColor: '#FFE8E8',
  },
  statusText: {
    color: '#2D3748',
    fontSize: 12,
  },
  actionsContainer: {
    width: 80,
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
  completeButton: {
    backgroundColor: colors.red,
    borderRadius: 10,
  },
  modalButtonText: {
    color: colors.red,
    fontWeight: 'bold',
  },
  completeButtonText: {
    color: colors.white,
  },
  cancelButtonText: {
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
});
