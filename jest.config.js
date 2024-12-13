module.exports = {
    testEnvironment: "node",
    setupFilesAfterEnv: ["<rootDir>/src/test/setupTest.js"],
    verbose: true,
    testMatch: ["<rootDir>/src/test/**/*.test.js"],
    moduleDirectories: ["node_modules", "<rootDir>/src"],
    collectCoverage: true,
    collectCoverageFrom: [
      "src/**/*.{js,jsx}",
      "!src/**/*.test.js",
      "!src/server.js",
    ],
    coverageDirectory: "coverage",
  };
  