import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

export const Dashboard = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleScanQR = () => {
    navigation.navigate('QRScanner');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <TouchableOpacity style={styles.scanButton} onPress={handleScanQR}>
        <Icon name="qrcode-scan" size={24} color={colors.white} />
        <Text style={styles.scanButtonText}>Scan QR Code</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.red,
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  scanButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
});
