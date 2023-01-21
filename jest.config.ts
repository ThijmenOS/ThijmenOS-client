import { pathsToModuleNameMapper } from "ts-jest";
import type { JestConfigWithTsJest } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

const config: JestConfigWithTsJest = {
  rootDir: "./",
  preset: "ts-jest",
  resetMocks: true,
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  verbose: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testEnvironment: "jsdom",
};

export default config;
