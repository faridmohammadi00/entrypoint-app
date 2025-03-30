import { MMKVLoader, MMKVInstance } from 'react-native-mmkv-storage';

let storage: MMKVInstance;

try {
  storage = new MMKVLoader()
    .withInstanceID('app-storage')
    .withEncryption()
    .initialize();
} catch (error) {
  console.error('MMKV initialization failed:', error);
  storage = new MMKVLoader().initialize();
}

export { storage };
