import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { colors } from '../theme/colors';

export const CustomDrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/logo/logo-write.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.drawerContent}>
        <DrawerItemList {...props} />
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    height: 120,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 240,
    height: 100,
  },
  drawerContent: {
    flex: 1,
  },
});
