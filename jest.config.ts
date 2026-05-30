import type { Config } from "jest";

const config: Config = {
  projects: [
    "<rootDir>/packages/shared/jest.config.ts",
    "<rootDir>/services/api/jest.config.ts",
    "<rootDir>/apps/mobile/jest.config.ts"
  ]
};

export default config;