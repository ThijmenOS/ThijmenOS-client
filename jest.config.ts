import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  rootDir: "./",
  preset: "ts-jest",
  resetMocks: true,
  moduleNameMapper: {
    "^@ostypes/(.*)$": "<rootDir>/src/types/$1",
    "^@drivers/(.*)$": "<rootDir>/src/drivers/$1",
    "^@core/(.*)$": "<rootDir>/src/core/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@icon/(.*)$": "<rootDir>/src/fileIcon/$1",
    "^@window/(.*)$": "<rootDir>/src/window/$1",
    "^@static/(.*)$": "<rootDir>/src/static/$1",
    "^@config/(.*)$": "<rootDir>/src/config/$1",
    "^@common/(.*)$": "<rootDir>/../javascriptOS-common/types/$1",
  },
  verbose: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};

export default config;
