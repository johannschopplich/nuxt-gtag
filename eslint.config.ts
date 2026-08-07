import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
}, {
  files: ['playground/**'],
  rules: {
    'no-console': 'off',
  },
})
