import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { updateUserStatus } from '../../store/slices/userSlice';
import type { AppDispatch } from '../../store';
import Toast from 'react-native-toast-message';

interface User {
  id: string;
  fullName: string;
  birthdate: string;
  email: string;
  gender: string;
  phone: string;
  plan: string;
  status: 'Active' | 'Not Active';
}

interface UserTableProps {
  users: User[];
}

export const UserTable = ({ users }: UserTableProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleStatusChange = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await dispatch(updateUserStatus({ id, status: newStatus })).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: (error as Error)?.message || 'Failed to update user status',
      });
    }
  };

  return (
    <ScrollView horizontal style={styles.tableContainer}>
      <View>
        <View style={styles.tableHeader}>
          <Text style={[styles.columnHeader, styles.idColumn]}>ID</Text>
          <Text style={[styles.columnHeader, styles.nameColumn]}>Full Name</Text>
          <Text style={[styles.columnHeader, styles.dateColumn]}>Birthdate</Text>
          <Text style={[styles.columnHeader, styles.emailColumn]}>Email</Text>
          <Text style={[styles.columnHeader, styles.genderColumn]}>Gender</Text>
          <Text style={[styles.columnHeader, styles.phoneColumn]}>Phone</Text>
          <Text style={[styles.columnHeader, styles.planColumn]}>Plan</Text>
          <Text style={[styles.columnHeader, styles.statusColumn]}>Status</Text>
          <Text style={[styles.columnHeader, styles.actionColumn]}>Action</Text>
        </View>
        <ScrollView>
          {users.map((user) => (
            <View key={user.id} style={styles.tableRow}>
              <Text style={[styles.cell, styles.idColumn]}>{user.id}</Text>
              <Text style={[styles.cell, styles.nameColumn]}>{user.fullName}</Text>
              <Text style={[styles.cell, styles.dateColumn]}>{user.birthdate}</Text>
              <Text style={[styles.cell, styles.emailColumn, styles.emailText]}>{user.email}</Text>
              <Text style={[styles.cell, styles.genderColumn]}>{user.gender}</Text>
              <Text style={[styles.cell, styles.phoneColumn, styles.phoneText]}>{user.phone}</Text>
              <Text style={[styles.cell, styles.planColumn]}>{user.plan}</Text>
              <View style={[styles.cell, styles.statusColumn]}>
                <Text style={[
                  styles.statusBadge,
                  user.status === 'Active' ? styles.activeBadge : styles.inactiveBadge,
                ]}>
                  {user.status}
                </Text>
              </View>
              <View style={[styles.cell, styles.actionColumn]}>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="pencil-outline" size={20} color={colors.gray} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="account-outline" size={20} color={colors.gray} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  columnHeader: {
    fontWeight: '600',
    padding: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  cell: {
    padding: 8,
  },
  idColumn: { width: 150 },
  nameColumn: { width: 200 },
  dateColumn: { width: 100 },
  emailColumn: { width: 200 },
  genderColumn: { width: 80 },
  phoneColumn: { width: 120 },
  planColumn: { width: 100 },
  statusColumn: { width: 100 },
  actionColumn: { width: 100, flexDirection: 'row' },
  emailText: {
    backgroundColor: '#e8f5e9',
    padding: 4,
    borderRadius: 4,
  },
  phoneText: {
    backgroundColor: '#e3f2fd',
    padding: 4,
    borderRadius: 4,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    textAlign: 'center',
  },
  activeBadge: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  inactiveBadge: {
    backgroundColor: '#ffebee',
    color: '#c62828',
  },
  actionButton: {
    padding: 4,
    marginHorizontal: 4,
  },
});
