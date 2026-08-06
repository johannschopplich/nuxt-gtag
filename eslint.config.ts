import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
}, {
  files: ['playground/**', 'examples/**'],
  rules: {
    'no-console': 'off',
  },
})
