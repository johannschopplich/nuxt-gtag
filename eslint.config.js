import antfu from '@antfu/eslint-config'

export default await antfu({
  rules: {
    'node/prefer-global/process': 'off',
    'ts/ban-types': 'off',
  },
})
