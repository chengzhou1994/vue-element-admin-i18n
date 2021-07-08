module.exports = {
  // 告诉jest需要解析的文件
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  // 告诉jest去哪里找模块资源，同webpack中的modules
  moduleDirectories: ['src', 'node_modules'],
  // 告诉jest针对不同类型的文件如何转义
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest',
    // '^.+\\.ts?$': 'ts-jest',
  },
  // 别名，同webpack中的alias
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // 快照的序列化工具
  snapshotSerializers: ['jest-serializer-vue'],
  // 告诉jest去哪里找我们编写的测试文件
  testMatch: ['**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'],

  // 统计哪里的文件
  collectCoverageFrom: [
    'src/utils/**/*.{js,vue}',
    '!src/utils/auth.js',
    '!src/utils/request.js',
    'src/components/**/*.{js,vue}',
  ],
  coverageDirectory: '<rootDir>/tests/unit/coverage',
  // 可以通过配置jest.config.json增加来生成测试覆盖率报告，生成报告会降低单测的速度，配置中默认是关闭的，需要手动开启。
  // 开启测试报告
  // 'collectCoverage': true,
  coverageReporters: ['lcov', 'text-summary'],
  // 默认test链接
  testURL: 'http://localhost/',
  // 在执行测试用例之前需要先执行的文件
  // setupFiles: ['jest-canvas-mock'],
}
