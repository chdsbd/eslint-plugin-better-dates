import { ESLintUtils } from '@typescript-eslint/experimental-utils'

const { getParserServices } = ESLintUtils

const version = require('../package.json').version

export const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/chdsbd/eslint-plugin-better-dates/blob/v${version}/packages/eslint-plugin/docs/rules/${name}.md`
)

export { getParserServices }
