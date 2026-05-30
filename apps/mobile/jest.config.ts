import type { Config } from "jest";

const config: Config = {
  displayName: "mobile",
  preset: "jest-expo",
  testMatch: ["<rootDir>/tests/**/*.test.{ts,tsx}"],
  moduleNameMapper: {
    "^expo-router$": "<rootDir>/tests/mocks/expoRouterMock.tsx",
    "^react$": "<rootDir>/../../node_modules/react",
    "^react-native$": "<rootDir>/tests/mocks/reactNativeMock.tsx"
  },
  setupFilesAfterEnv: []
};

export default config;