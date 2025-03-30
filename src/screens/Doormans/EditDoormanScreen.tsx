import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { doormanService } from '../../services/doorman.service';
import { Input } from '../../components/common/Input/Input';
import Toast from 'react-native-toast-message';
import { colors } from '../../theme/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { fetchDoormen } from '../../store/slices/doormanSlice';
import { AppDispatch } from '../../store';
import { IDoorman } from '../../services/doorman.service';

type RouteParams = {
  doormanId: string;
};

export const EditDoormanScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<IDoorman>>({
    fullname: '',
    email: '',
    phone: '',
    idNumber: '',
    city: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchDoorman = async () => {
      try {
        const doormanId = (route.params as RouteParams)?.doormanId;
        if (doormanId) {
          const response = await doormanService.getDoormanById(doormanId)
            .catch(async error => {
              throw error;
            });
          if (!response) {
            throw new Error('No response received from service');
          }
          setFormData({
            fullname: response.fullname,
            email: response.email,
            phone: response.phone,
            idNumber: response.idNumber,
            city: response.city || '',
            address: response.address || '',
          });
        } else {
          // TODO: Handle no doormanId found in route params
        }
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message || 'Failed to fetch doorman details',
        });
      }
    };

    fetchDoorman();
  }, [route.params]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullname?.trim()) {
      newErrors.fullname = 'Full name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.idNumber?.trim()) {
      newErrors.idNumber = 'ID number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {return;}

    setLoading(true);
    try {
      const doormanId = (route.params as RouteParams)?.doormanId;
      await doormanService.editDoorman(doormanId, formData);

      dispatch(fetchDoormen());

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Doorman updated successfully',
      });

      navigation.goBack();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update doorman';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Doorman</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Input
          label="Full Name"
          value={formData.fullname || ''}
          onChangeText={(text) => setFormData({ ...formData, fullname: text })}
          placeholder="Enter full name"
          style={styles.input}
        />
        {errors.fullname && (
          <Text style={styles.errorText}>{errors.fullname}</Text>
        )}

        <Input
          label="Email"
          value={formData.email || ''}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="Enter email"
          keyboardType="email-address"
          style={styles.input}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email}</Text>
        )}

        <Input
          label="Phone Number"
          value={formData.phone || ''}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          style={styles.input}
        />
        {errors.phone && (
          <Text style={styles.errorText}>{errors.phone}</Text>
        )}

        <Input
          label="ID Number"
          value={formData.idNumber || ''}
          onChangeText={(text) => setFormData({ ...formData, idNumber: text })}
          placeholder="Enter ID number"
          style={styles.input}
        />
        {errors.idNumber && (
          <Text style={styles.errorText}>{errors.idNumber}</Text>
        )}

        <Input
          label="City (Optional)"
          value={formData.city || ''}
          onChangeText={(text) => setFormData({ ...formData, city: text })}
          placeholder="Enter city"
          style={styles.input}
        />

        <Input
          label="Address (Optional)"
          value={formData.address || ''}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          placeholder="Enter address"
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.button}
            textColor={colors.textPrimary}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
            buttonColor={colors.red}
            textColor={colors.white}
          >
            Update Doorman
          </Button>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: 16,
  },
  backButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  input: {
    marginBottom: 8,
    backgroundColor: colors.transparent,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginBottom: 8,
  },
});
