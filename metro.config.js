const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Firebase JS SDK ships .cjs files
if (!config.resolver.sourceExts.includes('cjs')) {
  config.resolver.sourceExts.push('cjs');
}

// NOTE: Do NOT globally disable `unstable_enablePackageExports`.
// React Native 0.88+ needs package exports (e.g. `react-native/react-private-interface`).

module.exports = config;
