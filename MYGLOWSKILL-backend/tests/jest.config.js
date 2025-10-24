module.exports = {
  testEnvironment: "node",
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "controllers/**/*.js",
    "models/**/*.js",
    "services/**/*.js",
    "!node_modules/**",
  ],
  testMatch: ["**/tests/**/*.test.js"],
  verbose: true,
};
