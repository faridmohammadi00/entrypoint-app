import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Button } from '../../../components/common/Button/Button';
import { Input } from '../../../components/common/Input/Input';
import { colors } from '../../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store';
import { register } from '../../../store/slices/authSlice';
import Toast from 'react-native-toast-message';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Passwords do not match',
      });
      return;
    }

    try {
      setLoading(true);
      await dispatch(register({
        email,
        fullname: fullName,
        idNumber,
        phone: phoneNumber,
        password,
      })).unwrap();

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Registration successful!',
      });
      navigation.navigate('Login');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || error || 'Registration failed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color={colors.white} />
      </TouchableOpacity>

      <Image
        source={require('../../../assets/images/logo/logo-white-155x155.png')}
        style={styles.logo}
        resizeMode="contain"
      />

    <Text style={styles.title}>Register</Text>
    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.login}>Login</Text>
    </TouchableOpacity>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@gmail.com"
            icon={<Icon name="email-outline" size={24} color={colors.gray} />}
          />

          <Input
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="First Name / Last Name"
            icon={<Icon name="account-outline" size={24} color={colors.gray} />}
          />

          <Input
            label="Id Number"
            value={idNumber}
            onChangeText={setIdNumber}
            placeholder="Enter your Id Number"
            icon={<Icon name="card-account-details-outline" size={24} color={colors.gray} />}
          />

          <Input
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="+971555555555"
            icon={<Icon name="phone-outline" size={24} color={colors.gray} />}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Typing your password"
            secureTextEntry={!showPassword}
            icon={<Icon name="lock-outline" size={24} color={colors.gray} />}
            rightIcon={
              <Icon
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color={colors.gray}
              />
            }
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Typing your password"
            secureTextEntry={!showConfirmPassword}
            icon={<Icon name="lock-outline" size={24} color={colors.gray} />}
            rightIcon={
              <Icon
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color={colors.gray}
              />
            }
            onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <Button title="Register" onPress={handleRegister} loading={loading} />

          <View style={styles.divider}>
            <Text style={styles.dividerText}>OR</Text>
          </View>

          <TouchableOpacity style={styles.googleButton}>
            <Image
              source={require('../../../assets/images/icons/google/android_light_rd_na_1x.png')}
              style={styles.googleIcon}
            />
            <Text style={styles.googleText}>Register with Google</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.red,
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 24,
    zIndex: 1,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginTop: 80,
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    marginTop: 48,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },
  title: {
    position: 'absolute',
    left: 28,
    top: 184,
    fontSize: 32,
    fontWeight: '600',
    color: colors.white,
  },
  login: {
    position: 'absolute',
    right: 28,
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
  },
  divider: {
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerText: {
    color: colors.gray,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    padding: 12,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  googleText: {
    color: colors.black,
    fontSize: 16,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 48,
  },
});
