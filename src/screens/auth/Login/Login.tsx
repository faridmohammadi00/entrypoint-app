import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from '../../../components/common/Button/Button';
import { Input } from '../../../components/common/Input/Input';
import { colors } from '../../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store';
import { login, type LoginResponse } from '../../../store/slices/authSlice';
import Toast from 'react-native-toast-message';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const result = await dispatch(login({ email, password })).unwrap() as LoginResponse;
      console.log('login result', result);
      if (result.token) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Welcome back!',
        });
        navigation.navigate('DrawerNavigator');
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || error || 'Login failed',
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
      <Text style={styles.title}>Login</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.signup}>Signup</Text>
      </TouchableOpacity>
      <View style={styles.content}>

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@gmail.com"
          icon={<Icon name="email-outline" size={24} color={colors.gray} />}
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
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

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.rememberMe}
            onPress={() => setRememberMe(!rememberMe)}>
            <Icon
              name={rememberMe ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={24}
              color={colors.red}
            />
            <Text style={styles.rememberMeText}>Remember me</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password</Text>
          </TouchableOpacity>
        </View>

        <Button title="Login" onPress={handleLogin} loading={loading} />

        <View style={styles.divider}>
          <Text style={styles.dividerText}>OR</Text>
        </View>

        <TouchableOpacity style={styles.googleButton}>
          <Image
            source={require('../../../assets/images/icons/google/android_light_rd_na_1x.png')}
            style={styles.googleIcon}
          />
          <Text style={styles.googleText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
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
    left: 24,
    top: 184,
    fontSize: 32,
    fontWeight: '600',
    color: colors.white,
  },
  signup: {
    position: 'absolute',
    right: 24,
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    marginLeft: 8,
    color: colors.black,
  },
  forgotPassword: {
    color: colors.red,
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
});
