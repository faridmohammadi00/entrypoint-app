import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const Splash = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo/logo-200x200.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
