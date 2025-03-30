import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

export const QRScanner = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [scanned, setScanned] = useState(false);

  const onSuccess = (e: { data: string }) => {
    if (!scanned) {
      setScanned(true);
      console.log('Scanned QR Code:', e.data);
      Alert.alert('Success', 'QR Code scanned successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <QRCodeScanner
        onRead={onSuccess}
        flashMode={RNCamera.Constants.FlashMode.auto}
        topContent={
          <Text style={styles.instructions}>
            Position the QR code within the frame
          </Text>
        }
        containerStyle={styles.container}
        cameraStyle={styles.camera}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  instructions: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default QRScanner;
