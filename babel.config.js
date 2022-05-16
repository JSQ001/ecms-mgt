module.exports = {
  presets: [
    ['@vue/app', {
      useBuiltIns: 'entry'
    }]
  ],
  plugins: [
    [
      'import',
      {
        // 按需引入组件
        libraryName: 'ant-design-vue', libraryDirectory: 'es', style: 'css'
      }
    ]
  ]
}
