module.exports = {
    clearMocks: false,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",

    testEnvironment: "node",
    testMatch: [
        "**/__tests__/**/*.spec.ts"
    ],
};
