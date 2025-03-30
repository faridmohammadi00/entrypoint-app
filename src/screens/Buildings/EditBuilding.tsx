import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { buildingService } from '../../services/building.service';
import { Input } from '../../components/common/Input/Input';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { Picker } from '@react-native-picker/picker';

type RouteParams = {
  buildingId: string;
};

export const EditBuilding = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { buildingId } = route.params as RouteParams;
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    type: 'building' as 'building' | 'complex' | 'tower',
    latitude: 25.2048,
    longitude: 55.2708,
  });

  const fetchBuilding = useCallback(async () => {
    try {
      const response = await buildingService.getBuildingById(buildingId);
      setFormData({
        name: response.name,
        address: response.address,
        city: response.city,
        type: response.type as 'building' | 'complex' | 'tower',
        latitude: response.latitude,
        longitude: response.longitude,
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch building';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    }
  }, [buildingId]);

  useEffect(() => {
    fetchBuilding();
  }, [fetchBuilding]);

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.address || !formData.city) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please fill in all required fields',
        });
        return;
      }
      const response = await buildingService.updateBuilding(buildingId, formData);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response.message,
      });
      navigation.navigate('Buildings' as never);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update building';
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
        <Text style={styles.title}>Edit Building</Text>
      </View>

      <ScrollView style={styles.content}>
        <Input
          label="Building Name *"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          style={styles.input}
          placeholder="Enter building name"
        />

        <Input
          label="Address *"
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          style={styles.input}
          multiline
          numberOfLines={3}
          placeholder="Enter building address"
        />

        <Input
          label="City *"
          value={formData.city}
          onChangeText={(text) => setFormData({ ...formData, city: text })}
          style={styles.input}
          placeholder="Enter city name"
        />

        <Text style={styles.mapLabel}>Building Type *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.type}
            onValueChange={(itemValue) =>
              setFormData({ ...formData, type: itemValue })
            }
            style={styles.picker}
          >
            <Picker.Item label="Building" value="building" />
            <Picker.Item label="Complex" value="complex" />
            <Picker.Item label="Tower" value="tower" />
          </Picker>
        </View>

        <Text style={styles.mapLabel}>Location</Text>
        <Input
          label="Latitude"
          value={formData.latitude.toString()}
          onChangeText={(text) => {
            const lat = parseFloat(text) || 0;
            setFormData({ ...formData, latitude: lat });
          }}
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter latitude"
        />
        <Input
          label="Longitude"
          value={formData.longitude.toString()}
          onChangeText={(text) => {
            const long = parseFloat(text) || 0;
            setFormData({ ...formData, longitude: long });
          }}
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter longitude"
        />

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
            <Text style={[styles.buttonText, styles.submitButtonText]}>Update Building</Text>
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
  mapLabel: {
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
