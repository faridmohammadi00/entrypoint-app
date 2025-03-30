import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/types';
import { visitService } from '../../services/visit.service';
import { visitorService } from '../../services/visitor.service';
import { buildingService } from '../../services/building.service';
import Toast from 'react-native-toast-message';
import { Input } from '../../components/common/Input/Input';
import { Picker } from '../../components/common/Picker/Picker';
import DatePicker from 'react-native-date-picker';

interface Visitor {
  _id: string;
  fullname: string;
}

interface Building {
  _id: string;
  name: string;
}

interface VisitResponse {
  _id: string;
  building_id: {
    _id: string;
    name: string;
    address: string;
  };
  visitor_id: {
    _id: string;
    fullname: string;
    id_number: string;
  };
  user_id: {
    _id: string;
    fullname: string;
    email: string;
  };
  purpose: string;
  unit: string;
  check_in_date: string;
  check_out_date?: string;
  status: 'pending' | 'completed' | 'cancelled';
}

interface VisitFormData {
  _id: string;
  building_id: string;
  visitor_id: string;
  purpose: string;
  unit: string;
  check_in_date: Date;
  check_out_date?: Date;
  status: 'pending' | 'completed' | 'cancelled';
}

type RouteParams = {
  EditVisit: {
    visitId: string;
  };
};

export const EditVisit = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RouteParams, 'EditVisit'>>();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [formData, setFormData] = useState<VisitFormData>({
    _id: '',
    building_id: '',
    visitor_id: '',
    purpose: '',
    unit: '',
    check_in_date: new Date(),
    status: 'pending',
  });

  const fetchVisit = useCallback(async () => {
    try {
      const visit = await visitService.getVisitById(route.params.visitId) as VisitResponse;
      setFormData({
        _id: visit._id,
        building_id: visit.building_id._id,
        visitor_id: visit.visitor_id._id,
        purpose: visit.purpose,
        unit: visit.unit,
        check_in_date: new Date(visit.check_in_date),
        check_out_date: visit.check_out_date ? new Date(visit.check_out_date) : undefined,
        status: visit.status,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : 'Failed to fetch visit',
      });
    }
  }, [route.params.visitId]);

  const fetchVisitorsAndBuildings = async () => {
    try {
      const [visitorsResponse, buildingsResponse] = await Promise.all([
        visitorService.getAllVisitors(),
        buildingService.getAllBuildings(),
      ]);
      setVisitors(visitorsResponse);
      setBuildings(buildingsResponse);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : 'Failed to fetch data',
      });
    }
  };

  useEffect(() => {
    fetchVisit();
    fetchVisitorsAndBuildings();
  }, [fetchVisit]);

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.building_id || !formData.visitor_id || !formData.purpose || !formData.unit) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please fill in all required fields',
        });
        return;
      }

      await visitService.updateVisit(formData._id, formData);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Visit updated successfully',
      });
      navigation.navigate('VisitsReport', { refresh: true });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : 'Failed to update visit',
      });
    }
  };

  const handleStatusChange = async (newStatus: 'completed' | 'cancelled') => {
    try {
      await visitService.updateVisit(formData._id, {
        status: newStatus,
        check_out_date: newStatus === 'completed' ? new Date() : undefined,
      });

      setFormData(prev => ({
        ...prev,
        status: newStatus,
        check_out_date: newStatus === 'completed' ? new Date() : prev.check_out_date,
      }));

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Visit ${newStatus} successfully`,
      });

      navigation.navigate('VisitsReport', { refresh: true });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : 'Failed to update visit status',
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={colors.white} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Edit Visit</Text>
      </View>

      <ScrollView style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Building *</Text>
          <Picker
            selectedValue={formData.building_id}
            onValueChange={(value: string) => setFormData({ ...formData, building_id: value })}
            items={buildings.map(building => ({
              label: building.name,
              value: building._id,
            }))}
            placeholder="Select Building"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Visitor *</Text>
          <Picker
            selectedValue={formData.visitor_id}
            onValueChange={(value: string) => setFormData({ ...formData, visitor_id: value })}
            items={visitors.map(visitor => ({
              label: visitor.fullname,
              value: visitor._id,
            }))}
            placeholder="Select Visitor"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Check-in Date *</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setCheckInOpen(true)}
          >
            <Text>{new Date(formData.check_in_date).toLocaleString()}</Text>
          </TouchableOpacity>
          <DatePicker
            modal
            open={checkInOpen}
            date={formData.check_in_date}
            onConfirm={(date) => {
              setCheckInOpen(false);
              setFormData({ ...formData, check_in_date: date });
            }}
            onCancel={() => setCheckInOpen(false)}
            mode="date"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Check-out Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setCheckOutOpen(true)}
          >
            <Text>{formData.check_out_date ? new Date(formData.check_out_date).toLocaleString() : 'Select date'}</Text>
          </TouchableOpacity>
          <DatePicker
            modal
            open={checkOutOpen}
            date={formData.check_out_date || new Date()}
            onConfirm={(date) => {
              setCheckOutOpen(false);
              setFormData({ ...formData, check_out_date: date });
            }}
            onCancel={() => setCheckOutOpen(false)}
            mode="date"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Purpose *</Text>
          <Input
            label="Purpose"
            value={formData.purpose}
            onChangeText={(text: string) => setFormData({ ...formData, purpose: text })}
            placeholder="Enter purpose of visit"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Unit *</Text>
          <Input
            label="Unit"
            value={formData.unit}
            onChangeText={(text: string) => setFormData({ ...formData, unit: text })}
            placeholder="Enter unit number"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Status</Text>
          <View style={[
            styles.statusContainer,
            formData.status === 'completed' ? styles.completedStatus :
            formData.status === 'cancelled' ? styles.cancelledStatus :
            styles.pendingStatus,
          ]}>
            <Text style={styles.statusText}>
              {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
            </Text>
          </View>
        </View>

        {formData.status === 'pending' && (
          <View style={styles.statusButtons}>
            <TouchableOpacity
              style={[styles.statusButton, styles.completeButton]}
              onPress={() => handleStatusChange('completed')}
            >
              <Text style={styles.statusButtonText}>Complete Visit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusButton, styles.cancelButton]}
              onPress={() => handleStatusChange('cancelled')}
            >
              <Text style={[styles.statusButtonText, styles.cancelButtonText]}>Cancel Visit</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    marginTop: 40,
    backgroundColor: colors.red,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 16,
    marginLeft: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  form: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#2D3748',
    marginBottom: 8,
  },
  dateButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  statusContainer: {
    padding: 12,
    borderRadius: 8,
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
    fontSize: 16,
    color: '#2D3748',
    fontWeight: '500',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  statusButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: colors.red,
  },
  statusButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  statusCancelButtonText: {
    color: colors.red,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 24,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  submitButton: {
    backgroundColor: colors.red,
  },
  cancelButtonText: {
    color: colors.gray,
    fontSize: 16,
    fontWeight: '500',
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
});
