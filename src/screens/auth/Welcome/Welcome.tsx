import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Button } from '../../../components/common/Button/Button';
import { colors } from '../../../theme/colors';
import { useNavigation } from '@react-navigation/native';

export const Welcome = () => {
  const navigation = useNavigation();

  const handleSignIn = () => {
    navigation.navigate('Login');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/logo/logo-white-155x155.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Image
            source={require('../../../assets/images/icons/building-manager.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Manage</Text>
        <Text style={styles.subtitle}>Your Building</Text>
        <Text style={styles.tagline}>Smart</Text>

        <Button title="Sign In" onPress={handleSignIn} />

        <View style={styles.divider}>
          <Text style={styles.dividerText}>OR</Text>
        </View>

        <Button
          title="Register"
          onPress={handleRegister}
          variant="secondary"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.red,
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
  iconContainer: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 24,
  },
  icon: {
    width: 48,
    height: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.black,
  },
  subtitle: {
    fontSize: 32,
    fontWeight: '400',
    textAlign: 'center',
    color: colors.black,
  },
  tagline: {
    fontSize: 32,
    fontWeight: '300',
    textAlign: 'center',
    color: colors.black,
    marginBottom: 48,
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
});
