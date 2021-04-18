# Bans mutating dates (`ban-date-mutation`)

Mutating dates can create confusing bugs. Instead, create new dates using a library like [`date-fns`](https://github.com/date-fns/date-fns).

## Rule Details

This rule bans methods that mutate `Date`.

Banned `Date` methods:

- `setDate`
- `setFullYear`
- `setHours`
- `setMilliseconds`
- `setMinutes`
- `setMonth`
- `setSeconds`
- `setTime`
- `setUTCDate`
- `setUTCFullYear`
- `setUTCHours`
- `setUTCMilliseconds`
- `setUTCMinutes`
- `setUTCMonth`
- `setUTCSeconds`
- `setYear`

### Examples

Examples of **incorrect** code with the default options:

```ts
const expiration = new Date()

const noon = expiration.setHours(12)
const seventeenth = expiration.setDate(17)
const twentyTen = expiration.setFullYear(2010, 05, 23)
const thirtySeconds = expiration.setSeconds(30)
```

Examples of **correct** code with the default options:

```ts
const expiration = new Date()

import setHours from 'date-fns/setHours'
const noon = setHours(setHours, 12)

import setDate from 'date-fns/setDate'
const seventeenth = setDate(expiration, 17)

import setYear from 'date-fns/setYear'
import setMonth from 'date-fns/setMonth'
import setDate from 'date-fns/setDate'
const twentyTen = setDate(setMonth(setYear(expiration, 2010), 05), 23)

import setSeconds from 'date-fns/setSeconds'
const thirtySeconds = setSeconds(expiration, 30)
```

## When Not To Use It

If you don't mind the risk of date mutations causing bugs in your system.
