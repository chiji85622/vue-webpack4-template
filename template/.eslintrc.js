// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  // 使用eslint-plugin-vue插件，添加plugin:vue/essential
  // 使用airbnb规则
  extends: ['plugin:vue/essential', 'airbnb-base'],
  // 检查vue文件
  plugins: [
    'vue',
  ],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js'
      }
    }
  },
  // 增加自定义规则
  rules: {
    // 导入时不需要.VUE扩展
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never'
    }],
    // 函数参数的不可再赋值
    // 不允许参数对象操作，除非特定排除
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e' // for e.returnvalue
      ]
    }],
    // 允许选择依赖关系
    'import/no-extraneous-dependencies': ['error', {
      optionalDependencies: ['test/unit/index.js']
    }],
    // 在开发过程中允许调试器
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
