/** @type {import("jest").Config} **/
export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  setupFiles: ["<rootDir>/src/setupJestEnvironment.js"],
  testRunner: "jest-circus/runner",
  globalSetup: "<rootDir>/jest.globalSetup.js",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "./tsconfig.json",
        useESM: true, // Enable ESM support to handle import.meta.url
        isolatedModules: true,
        tsconfigDefaults: {
          compilerOptions: {
            esModuleInterop: true
          }
        }
      }
    ],
  },
  transformIgnorePatterns: [
    // Don't ignore our source files, only node_modules
    "/node_modules/(?!(@mlc-ai/web-llm|@babel/runtime)/)",
  ],
  testMatch: [
    "**/__tests__/**/*.(j|t)s?(x)",
    "**/?(*.)+(spec|test).(j|t)s?(x)"
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|scss|sass|less)$": "identity-obj-proxy",
    "^\\./App$": "<rootDir>/src/App.test.mock.tsx",
    "^\\.\\/App\\.tsx$": "<rootDir>/src/App.test.mock.tsx",
  },
  // Enable ESM support
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  // Force modules that should be mocked
  automock: false,
  // Ensure our source files are also transformed
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/setupTests.{ts,tsx}",
  ],
};