import type { Config } from "jest";

const config: Config = {
  displayName: "api",
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  testMatch: ["<rootDir>/tests/**/*.test.ts"]
};

export default config;