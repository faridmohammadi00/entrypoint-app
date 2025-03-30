const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {wrapWithReanimatedMetroConfig} = require('react-native-reanimated/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx'],
  },
};

// First merge the default config with our custom one
const defaultConfig = mergeConfig(getDefaultConfig(__dirname), config);
// Then wrap it with Reanimated's Metro config
module.exports = wrapWithReanimatedMetroConfig(defaultConfig);
