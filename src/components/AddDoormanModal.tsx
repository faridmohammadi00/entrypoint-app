import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Text, Portal, Modal, Button } from 'react-native-paper';
import { doormanService } from '../services/doorman.service';
import { Input } from './common/Input/Input';
import Toast from 'react-native-toast-message';
import { colors } from '../theme/colors';

interface AddDoormanModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSuccess: () => void;
}

export const AddDoormanModal: React.FC<AddDoormanModalProps> = ({
  visible,
  onDismiss,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    phone: '',
    idNumber: '',
    city: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.idNumber.trim()) {
      newErrors.idNumber = 'ID number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {return;}

    setLoading(true);
    try {
      await doormanService.registerDoorman({
        ...formData,
        role: 'doorman',
        status: 'inactive',
      });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Doorman registered successfully',
      });
      onSuccess();
      onDismiss();
      setFormData({
        fullname: '',
        email: '',
        password: '',
        phone: '',
        idNumber: '',
        city: '',
        address: '',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : 'Failed to register doorman',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <ScrollView>
          <Text style={styles.title}>Add New Doorman</Text>

          <Input
            label="Full Name"
            value={formData.fullname}
            onChangeText={(text) => setFormData({ ...formData, fullname: text })}
            placeholder="Enter full name"
            style={styles.input}
          />
          {errors.fullname && (
            <Text style={styles.errorText}>{errors.fullname}</Text>
          )}

          <Input
            label="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="Enter email"
            keyboardType="email-address"
            style={styles.input}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}

          <Input
            label="Password"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            placeholder="Enter password"
            secureTextEntry
            style={styles.input}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          <Input
            label="Phone Number"
            value={formData.phone}
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
            value={formData.idNumber}
            onChangeText={(text) => setFormData({ ...formData, idNumber: text })}
            placeholder="Enter ID number"
            style={styles.input}
          />
          {errors.idNumber && (
            <Text style={styles.errorText}>{errors.idNumber}</Text>
          )}

          <Input
            label="City (Optional)"
            value={formData.city}
            onChangeText={(text) => setFormData({ ...formData, city: text })}
            placeholder="Enter city"
            style={styles.input}
          />

          <Input
            label="Address (Optional)"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            placeholder="Enter address"
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={onDismiss}
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
              Add Doorman
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: colors.white,
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.textPrimary,
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
