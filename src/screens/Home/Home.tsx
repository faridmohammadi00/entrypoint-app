import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to HalaDesk</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  text: {
    fontSize: 24,
    color: colors.black,
  },
});
