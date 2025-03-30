import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../store/slices/userSlice';
import type { AppDispatch, RootState } from '../../store';
import Toast from 'react-native-toast-message';

export interface User {
  id: string;
  fullName: string;
  birthdate: string;
  email: string;
  gender: string;
  phone: string;
  plan: string;
  status: 'Active' | 'Not Active';
}

export const Users = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchUsers())
      .unwrap()
      .catch((error: any) => {
        console.log('error', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message || 'Failed to fetch users',
        });
      });
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users</Text>

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
        <TouchableOpacity style={styles.addButton}>
          <Icon name="plus" size={24} color={colors.white} />
          <Text style={styles.addButtonText}>Add New User</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.red} />
      ) : (
        <View style={styles.tableContainer}>
          {/* Combined Table Header and Content */}
          <ScrollView horizontal={true} style={styles.horizontalScroll}>
            <View>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, styles.idCell]}>ID</Text>
                <Text style={[styles.headerCell, styles.nameCell]}>Full Name</Text>
                <Text style={[styles.headerCell, styles.dateCell]}>Birthdate</Text>
                <Text style={[styles.headerCell, styles.emailCell]}>Email</Text>
                <Text style={[styles.headerCell, styles.smallCell]}>Gender</Text>
                <Text style={[styles.headerCell, styles.phoneCell]}>Phone</Text>
                <Text style={[styles.headerCell, styles.planCell]}>Plan</Text>
                <Text style={[styles.headerCell, styles.statusCell]}>Status</Text>
                <Text style={[styles.headerCell, styles.actionsCell]}>Action</Text>
              </View>

              {/* Table Content */}
              <ScrollView style={styles.tableContent} contentContainerStyle={styles.tableContentContainer}>
                {users?.map((user, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.cell, styles.idCell]}>{user.id}</Text>
                    <Text style={[styles.cell, styles.nameCell]}>{user.fullName}</Text>
                    <Text style={[styles.cell, styles.dateCell]}>{user.birthdate}</Text>
                    <Text style={[styles.cell, styles.emailCell]}>{user.email}</Text>
                    <Text style={[styles.cell, styles.smallCell]}>{user.gender}</Text>
                    <Text style={[styles.cell, styles.phoneCell]}>{user.phone}</Text>
                    <Text style={[styles.cell, styles.planCell]}>{user.plan}</Text>
                    <View style={[styles.statusContainer, user.status === 'Active' ? styles.activeStatus : styles.inactiveStatus]}>
                      <Text style={styles.statusText}>{user.status}</Text>
                    </View>
                    <View style={styles.actionsContainer}>
                      <TouchableOpacity style={styles.actionButton}>
                        <Icon name="pencil" size={20} color={colors.gray} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <Icon name="account" size={20} color={colors.gray} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
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
      )}
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
  dateCell: {
    width: 100,
  },
  emailCell: {
    width: 200,
  },
  smallCell: {
    width: 80,
  },
  phoneCell: {
    width: 120,
  },
  planCell: {
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
