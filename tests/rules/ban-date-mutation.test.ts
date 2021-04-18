import rule from '../../src/rules/ban-date-mutation'
import { RuleTester, getFixturesRootDir } from '../RuleTester'

const rootDir = getFixturesRootDir()
const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    tsconfigRootDir: rootDir,
    project: './tsconfig.json',
  },
})

ruleTester.run('ban-date-mutation', rule, {
  valid: [
    {
      code: `
      let foo = new Date();
      foo.getSeconds();
    `,
    },
    {
      code: `
      class Date {
        setSeconds(seconds: number) {
          console.log(seconds);
        }
      }
      const foo = new Date();
      foo.getSeconds();
    `,
    },
  ],
  invalid: [
    {
      code: `
        let foo = new Date();
        foo.setSeconds(123);
      `,
      errors: [
        {
          messageId: 'banDateMutation',
          data: {
            method: 'setSeconds',
            suggestion: ' Replace `Date.setSeconds` with `date-fns/setSeconds`',
          },
          line: 3,
          column: 9,
        },
      ],
      options: [],
    },
    {
      code: `
        let foo = new Date();
        foo.setHours(123);
      `,
      errors: [
        {
          messageId: 'banDateMutation',
          data: {
            method: 'setHours',
            suggestion:
              ' Replace `Date.setHours` with `date-fns/{setHours,setMinutes,setSeconds,setMilliseconds}`',
          },
          line: 3,
          column: 9,
        },
      ],
      options: [],
    },
  ],
})
