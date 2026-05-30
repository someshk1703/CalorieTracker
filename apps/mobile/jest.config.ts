import type { Config } from "jest";

const config: Config = {
  displayName: "mobile",
  preset: "jest-expo",
  testMatch: ["<rootDir>/tests/**/*.test.{ts,tsx}"],
  moduleNameMapper: {
    "^react$": "<rootDir>/../../node_modules/react",
    "^react-native$": "<rootDir>/tests/mocks/reactNativeMock.tsx"
  },
  setupFilesAfterEnv: []
};

export default config;