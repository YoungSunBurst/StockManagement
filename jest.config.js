// https://github.com/ProminentEdge/mobile-boilerplate
const { defaults: tsjPreset } = require("ts-jest/presets");

module.exports = {
  ...tsjPreset,
  preset: "react-native",
  setupTestFrameworkScriptFile: "./setup-tests.js",
  transform: {
    ...tsjPreset.transform,
    // transform: { '^.+\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js' },
    "\\.js$": "<rootDir>/node_modules/react-native/jest/preprocessor.js",
    "^.+\\.test.(ts|tsx)$": "ts-jest"
  },
  transformIgnorePatterns: [
    "node_modules/(?!react-native|native-base-shoutem-theme|@shoutem/animation|@shoutem/ui|tcomb-form-native|react-navigation-stack|react-navigation)"
  ],
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json"
    }
  },
  cacheDirectory: ".jest/cache"
};
