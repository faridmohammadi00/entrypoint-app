import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
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

export const CreateVisit = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [formData, setFormData] = useState({
    building_id: '',
    visitor_id: '',
    purpose: '',
    unit: '',
    check_in_date: new Date(),
    check_out_date: new Date(),
    status: 'pending' as 'pending' | 'completed' | 'cancelled',
    user_id: '1',
  });

  useEffect(() => {
    fetchVisitorsAndBuildings();
  }, []);

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

      await visitService.createVisit(formData);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Visit created successfully',
      });

      // Navigate back with a refresh parameter
      navigation.navigate('VisitsReport', { refresh: true });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : 'Failed to create visit',
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
        <Text style={styles.title}>Create New Visit</Text>
      </View>

      <ScrollView style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Building *</Text>
          <Picker
            selectedValue={formData.building_id}
            onValueChange={(value) => setFormData({ ...formData, building_id: value })}
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
            onValueChange={(value) => setFormData({ ...formData, visitor_id: value })}
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
            <Text>{formData.check_in_date.toLocaleDateString()}</Text>
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
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Check-out Date *</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setCheckOutOpen(true)}
          >
            <Text>{formData.check_out_date.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <DatePicker
            modal
            open={checkOutOpen}
            date={formData.check_out_date}
            onConfirm={(date) => {
              setCheckOutOpen(false);
              setFormData({ ...formData, check_out_date: date });
            }}
            onCancel={() => setCheckOutOpen(false)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Purpose *</Text>
          <Input
            label="Purpose"
            value={formData.purpose}
            onChangeText={(text) => setFormData({ ...formData, purpose: text })}
            placeholder="Enter purpose of visit"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Unit *</Text>
          <Input
            label="Unit"
            value={formData.unit}
            onChangeText={(text) => setFormData({ ...formData, unit: text })}
            placeholder="Enter unit number"
          />
        </View>

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
            <Text style={styles.submitButtonText}>Create Visit</Text>
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
    backgroundColor: colors.red,
    marginTop: 40,
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
  dateButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: colors.white,
  },
});
