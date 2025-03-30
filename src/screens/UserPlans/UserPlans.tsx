import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { activePlanService } from '../../services/activePlan.service';
import { useDispatch } from 'react-redux';
import { cancelActivePlan } from '../../store/slices/activePlanSlice';
import { AppDispatch } from '../../store';

interface PlanDetails {
  _id: string;
  planName: string;
  price: number;
  monthlyVisits: number;
  buildingCredit: number;
  userCredit: number;
  status: 'active' | 'pending';
  createdAt: string;
  updatedAt: string;
}

interface UserPlan {
  _id: string;
  userId: string;
  planId: PlanDetails;
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  date: string;
  createdAt: string;
  updatedAt: string;
}

export const UserPlans = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  useEffect(() => {
    fetchUserPlans();
  }, []);

  const fetchUserPlans = async () => {
    try {
      const response = await activePlanService.getUserActivePlans('all');
      setUserPlans(response);
    } catch (error) {
      console.error('Error fetching user plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return styles.activeStatus;
      case 'pending':
        return styles.pendingStatus;
      case 'expired':
        return styles.expiredStatus;
      case 'cancelled':
        return styles.cancelledStatus;
      default:
        return styles.pendingStatus;
    }
  };

  const handleCancelPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setShowModal(true);
  };

  const confirmCancelPlan = async () => {
    if (!selectedPlanId) {return;}

    try {
      await dispatch(cancelActivePlan(selectedPlanId)).unwrap();
      fetchUserPlans();
      setShowModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel the plan. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Plans</Text>

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
              <Text>Date</Text>
              <Icon name="chevron-down" size={20} color={colors.gray} />
            </View>
            <TouchableOpacity style={styles.resetButton}>
              <Icon name="refresh" size={18} color="red" />
              <Text style={styles.resetText}>Reset Filter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <View style={styles.tableContainer}>
        <ScrollView horizontal={true} style={styles.horizontalScroll}>
          <View>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.planCell]}>Plan Name</Text>
              <Text style={[styles.headerCell, styles.priceCell]}>Price</Text>
              <Text style={[styles.headerCell, styles.visitsCell]}>Monthly Visits</Text>
              <Text style={[styles.headerCell, styles.creditCell]}>Credits (B/U)</Text>
              <Text style={[styles.headerCell, styles.dateCell]}>Date</Text>
              <Text style={[styles.headerCell, styles.statusCell]}>Status</Text>
              <Text style={[styles.headerCell, styles.actionsCell]}>Actions</Text>
            </View>

            {/* Table Content */}
            <ScrollView style={styles.tableContent}>
              {userPlans.map((plan, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.cell, styles.planCell]}>{plan.planId.planName}</Text>
                  <Text style={[styles.cell, styles.priceCell]}>${plan.planId.price}</Text>
                  <Text style={[styles.cell, styles.visitsCell]}>{plan.planId.monthlyVisits}</Text>
                  <Text style={[styles.cell, styles.creditCell]}>
                    {plan.planId.buildingCredit}/{plan.planId.userCredit}
                  </Text>
                  <Text style={[styles.cell, styles.dateCell]}>
                    {new Date(plan.date).toLocaleDateString()}
                  </Text>
                  <View style={[styles.statusContainer, getStatusStyle(plan.status)]}>
                    <Text style={styles.statusText}>{plan.status}</Text>
                  </View>
                  <View style={styles.actionsContainer}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleCancelPlan(plan._id)}
                    >
                      <Icon name="delete" size={20} color={colors.gray} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>

        {/* Pagination */}
        <View style={styles.pagination}>
          <Text style={styles.paginationText}>Showing 1-10 of {userPlans.length}</Text>
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

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cancel Plan</Text>
            <Text style={styles.modalText}>
              Are you sure you want to cancel this plan?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.approveButton]}
                onPress={confirmCancelPlan}
              >
                <Text style={[styles.modalButtonText, styles.approveButtonText]}>
                  Approve
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
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerCell: {
    padding: 16,
    fontWeight: 'bold',
  },
  tableContent: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    alignItems: 'center',
  },
  cell: {
    padding: 16,
  },
  planCell: {
    width: 200,
  },
  priceCell: {
    width: 100,
  },
  visitsCell: {
    width: 120,
  },
  creditCell: {
    width: 120,
  },
  dateCell: {
    width: 120,
  },
  statusCell: {
    width: 120,
  },
  actionsCell: {
    width: 100,
  },
  statusContainer: {
    padding: 8,
    borderRadius: 4,
    width: 100,
    alignItems: 'center',
    margin: 8,
  },
  activeStatus: {
    backgroundColor: '#E8F5E9',
  },
  pendingStatus: {
    backgroundColor: '#FFF3E0',
  },
  expiredStatus: {
    backgroundColor: '#FFEBEE',
  },
  cancelledStatus: {
    backgroundColor: '#ECEFF1',
  },
  statusText: {
    textTransform: 'capitalize',
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 8,
    width: 100,
  },
  actionButton: {
    padding: 8,
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
    color: colors.gray,
  },
  paginationControls: {
    flexDirection: 'row',
  },
  pageButton: {
    padding: 8,
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
  approveButton: {
    backgroundColor: colors.red,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  approveButtonText: {
    color: colors.white,
  },
});
