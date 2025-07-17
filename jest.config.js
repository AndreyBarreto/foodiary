module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    moduleNameMapper: {
        '^@kernel/(.*)$': '<rootDir>/src/kernel/$1',
        '^@main/(.*)$': '<rootDir>/src/main/$1',
        '^@application/(.*)$': '<rootDir>/src/application/$1',
        '^@infra/(.*)$': '<rootDir>/src/infra/$1',
        '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    },
};
