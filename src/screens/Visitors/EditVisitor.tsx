import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { visitorService } from '../../services/visitor.service';
import { Input } from '../../components/common/Input/Input';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { Picker } from '@react-native-picker/picker';

type RouteParams = {
  visitorId: string;
};

export const EditVisitor = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { visitorId } = route.params as RouteParams;
  const [formData, setFormData] = useState({
    fullname: '',
    id_number: '',
    birthday: new Date(),
    gender: 'male' as 'male' | 'female' | 'other',
    region: '',
    expire_date: new Date(),
    phone: '',
    status: 'active' as 'active' | 'inactive',
  });

  const fetchVisitor = useCallback(async () => {
    try {
      const response = await visitorService.getVisitorById(visitorId);
      setFormData({
        fullname: response.fullname,
        id_number: response.id_number,
        birthday: new Date(response.birthday),
        gender: response.gender,
        region: response.region,
        expire_date: new Date(response.expire_date),
        phone: response.phone,
        status: response.status,
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch visitor';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    }
  }, [visitorId]);

  useEffect(() => {
    fetchVisitor();
  }, [fetchVisitor]);

  const handleSubmit = async () => {
    try {
      if (!formData.fullname || !formData.id_number || !formData.region || !formData.phone) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please fill in all required fields',
        });
        return;
      }
      const response = await visitorService.updateVisitor(visitorId, formData);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response.message,
      });
      navigation.navigate('Visitors' as never);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update visitor';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Visitor</Text>
      </View>

      <ScrollView style={styles.content}>
        <Input
          label="Full Name *"
          value={formData.fullname}
          onChangeText={(text) => setFormData({ ...formData, fullname: text })}
          style={styles.input}
          placeholder="Enter full name"
        />

        <Input
          label="ID Number *"
          value={formData.id_number}
          onChangeText={(text) => setFormData({ ...formData, id_number: text })}
          style={styles.input}
          placeholder="Enter ID number"
        />

        <Input
          label="Phone Number *"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          style={styles.input}
          keyboardType="phone-pad"
          placeholder="Enter phone number"
        />

        <Text style={styles.label}>Gender *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.gender}
            onValueChange={(itemValue) =>
              setFormData({ ...formData, gender: itemValue })
            }
            style={styles.picker}
          >
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>

        <Input
          label="Region *"
          value={formData.region}
          onChangeText={(text) => setFormData({ ...formData, region: text })}
          style={styles.input}
          placeholder="Enter region"
        />

        <Input
          label="Birthday"
          value={formData.birthday.toISOString().split('T')[0]}
          onChangeText={(text) => setFormData({ ...formData, birthday: new Date(text) })}
          style={styles.input}
          placeholder="YYYY-MM-DD"
        />

        <Input
          label="Expire Date"
          value={formData.expire_date.toISOString().split('T')[0]}
          onChangeText={(text) => setFormData({ ...formData, expire_date: new Date(text) })}
          style={styles.input}
          placeholder="YYYY-MM-DD"
        />

        <Text style={styles.label}>Status *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.status}
            onValueChange={(itemValue) =>
              setFormData({ ...formData, status: itemValue })
            }
            style={styles.picker}
          >
            <Picker.Item label="Active" value="active" />
            <Picker.Item label="Inactive" value="inactive" />
          </Picker>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
          >
            <Text style={[styles.buttonText, styles.submitButtonText]}>Update Visitor</Text>
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
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    marginTop: 40,
    backgroundColor: colors.red,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: 16,
  },
  content: {
    padding: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: colors.white,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#2D3748',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  submitButton: {
    backgroundColor: colors.red,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A5568',
  },
  submitButtonText: {
    color: colors.white,
  },
  backButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: colors.white,
  },
  picker: {
    height: 50,
  },
});
