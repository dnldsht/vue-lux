# vue-lux

`vue-lux` is a Vue 3 library that simplifies DateTime formatting and parsing using the powerful Luxon library. Inspired by [vue-luxon](https://github.com/casbloem/vue-luxon).

## Install

```shell
yarn add vue-lux
pnpm i vue-lux
npm i vue-lux
```

### Vue

```javascript
import { createApp } from 'vue'
import VueLuxon from 'vue-lux'
import App from './App.vue'

const app = createApp(App)
app.use(VueLux, {
  input: {
    zone: 'utc',
    format: 'iso'
  },
  output: 'short'
})
app.mount('#app')
```

### Nuxt
```javascript
export default defineNuxtConfig({
  modules: ['vue-lux/nuxt'],
  lux: {
    input: {
      zone: 'utc',
      format: 'iso'
    },
    output: 'short'
  }
})
```

By default, vue-lux expect the given datetime string to be time zone `utc` and format `iso` . The output will be based on the client's locale.

[Learn more about settings](#settings)

## Formatting

You can use the `$lux` or `$lf` method everywhere in your vue app to formate a date:

```js
this.$lux('2020-10-05T14:48:00.000Z')
// October 5, 2020
```

You can change the output format:

```js
this.$lux('2020-10-05T14:48:00.000Z', 'dd-MM-yyyy')
// 05-10-2020

this.$lux('2020-10-05 22:36', 'relative')
// 22 days ago
```

And other settings:

```js
this.$lux('2020-10-05 22:36', 'full', { format: 'yyyy-MM-dd HH:mm', zone: 'Asia/Tokyo' })
// October 5, 2020, 3:36 PM GMT+2
```

These formats will be in the clients browser language, unless you set a [specific language].

## Parsing

You can use the `$lp` method to parse a date and retrive a Luxon DateTime object:

```js
this.$lp('2020-10-05T14:48:00.000Z')
// DateTime { 2020-10-05T14:48:00.000Z }

this.$lp('2020-10-05 22:36', 'yyyy-MM-dd HH:mm')
// DateTime { 2020-10-05T22:36:00.000Z }
```

## Settings

You can define the default input and output settings in the plugin options.

```js
{
  input: {
    zone: 'utc',
    format: 'iso',
  },
  output: {
    locale: 'en',
    format: 'short',
  },
  templates: {
    userDate: {
      zone: 'client',
      format: 'dd MM yyyy',
    },
    serverAMS: {
      zone: 'Europe/Amsterdam',
      format: 'dd-MM-yyyy HH:mm:ss',
    },
    client: {
      zone: 'local',
      format: 'short',
    },
  },
}
```

### Templates
Templates are predefined formats that can be used to quickly format and parse.

```js
// Will use the template userDate to format the date
this.$lux('2020-10-05T14:48:00.000Z', 'userDate')
// 05 10 2020

// Will use serverAMS template to parse the date
this.$lp('2020-10-05 22:36', 'serverAMS')
// DateTime { 2020-10-05T22:36:00.000Z }

// Will use serverAMS template to parse and userDate template to format the date
this.$lux('2020-10-05 22:36', 'userDate', 'serverAMS')
// 05 10 2020
```

By default there are these templates available:

| format           | example _(with locale `en_US`)_                            |
| ---------------- | ---------------------------------------------------------- |
| short            | 10/14/1983, 1:30 PM                                        |
| shorts           | 10/14/1983, 1:30:23 PM                                     |
| med              | Oct 14, 1983, 1:30 PM                                      |
| meds             | Oct 14, 1983, 9:30:33 AM                                   |
| full             | October 14, 1983, 9:30 AM EDT                              |
| fulls            | October 14, 1983, 9:30:33 AM EDT                           |
| huge             | Friday, October 14, 1983, 9:30 AM Eastern Daylight Time    |
| huges            | Friday, October 14, 1983, 9:30:33 AM Eastern Daylight Time |
| time             | 9:30 AM                                                    |
| times            | 09:30:23 AM                                                |
| time24           | 09:30                                                      |
| time24s          | 09:30:23                                                   |
| time24longoffset | 09:30:23 Eastern Daylight Time                             |
| date_full        | October 14, 1983                                           |
| date_huge        | Tuesday, October 14, 1983                                  |
| date_med         | Oct 14, 1983                                               |
| date_medd        | Fri, Oct 14, 1983                                          |
| date_short       | 10/14/1983                                                 |

### Input

The input can be one of the following types:

- **string**: A string representation of a date or time.
- **number**: A numeric representation of a date or time, such as a timestamp.
- **Date**: A JavaScript Date object.
- **DateTime**: A DateTime object from the Luxon library.

Along with the input, you can also specify the input format and zone.

```ts
import type { Zone } from 'luxon'

interface InputOptions {
  format: string
  zone?: string | Zone
}
```
Available formats are:

| format         | description                          | example                                                     |
| -------------- | ------------------------------------ | ----------------------------------------------------------- |
| sql            | SQL dates, times, and datetimes      | `2017-05-15 09:24:15`                                       |
| iso            | ISO 8601 date time string            | `2018-01-06T13:07:04.054`                                   |
| rfc2822        | RFC 2822                             | `Tue, 01 Nov 2016 13:23:12 +0630`                           |
| http           | HTTP header specs (RFC 850 and 1123) | `Sun, 06 Nov 1994 08:49:37 GMT`                             |
| seconds        | Unix timestamp                       | `1542674993`                                                |
| millis         | Unix timestamp milliseconds          | `1542674993410`                                             |
| Date           | JavaScript Date object               | `new Date('2020-10-05T14:48:00.000Z')`                      |
| DateTime       | Luxon DateTime object                | `DateTime.fromISO('2020-10-05T14:48:00.000Z')`              |
| _tokens_       | see: [Tokens](#tokens)               | `yyyy-MM-dd`                                                |
| *templateName* | see: [Templates](#templates)         |                                                             |

### Output

```ts
import type { DateTimeFormatOptions, ToISOTimeOptions, ToRelativeOptions, ToSQLOptions, Zone } from 'luxon'

interface OutputOptions {
  locale?: string
  format?: string | DateTimeFormatOptions | Intl.DateTimeFormatOptions
  relative?: ToRelativeOptions
  sql?: ToSQLOptions
  iso?: ToISOTimeOptions
  zone?: string | Zone
}
```

- **format**: The format to use for formatting.
  - Set of Tokens: You can use a set of tokens to define the output format. Tokens represent different parts of the date and time, such as year, month, day, hour, minute, etc. See [Tokens](#tokens) for possible values.
  - Template Name: You can specify the name of a predefined template. Templates are predefined formats that can be used to quickly format dates and times. See [Templates](#templates) for possible values.
  - DateTimeFormatOptions: Options for the DateTime format. See [DateTimeFormatOptions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) for possible values.

- **locale**: The locale to use for formatting. If not set, the client's locale will be used.
- **relative**: Options for the relative format. See [Relative](https://moment.github.io/luxon/api-docs/index.html#datetimetorelative) for possible values.
- **sql**: Options for the SQL format. See [SQL](https://moment.github.io/luxon/api-docs/index.html#datetimetosql) for possible values.
- **iso**: Options for the ISO format. See [ISO](https://moment.github.io/luxon/api-docs/index.html#datetimetoiso) for possible values.

### Zone

eg: `UTC`, `America/New_York`, `Asia/Tokyo`, ...

For the systems local zone you use `local`.

There is a [list on wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

### Locale

Examples:

`en`: English (primary language).
`hi`: Hindi (primary language).
`de-AT`: German as used in Austria (primary language with country code).
`zh-Hans-CN`: Chinese written in simplified

The client's locale will be used if not set.

### Tokens

Tokens are useful for formatting and parsing.

You can use the following tokens:

| Standalone token | Format token | Description                                                  | Example                                                     |
| ---------------- | ------------ | ------------------------------------------------------------ | ----------------------------------------------------------- |
| S                |              | millisecond, no padding                                      | 54                                                          |
| SSS              |              | millisecond, padded to 3                                     | 054                                                         |
| u                |              | fractional seconds, functionally identical to SSS            | 054                                                         |
| s                |              | second, no padding                                           | 4                                                           |
| ss               |              | second, padded to 2 padding                                  | 04                                                          |
| m                |              | minute, no padding                                           | 7                                                           |
| mm               |              | minute, padded to 2                                          | 07                                                          |
| h                |              | hour in 12-hour time, no padding                             | 1                                                           |
| hh               |              | hour in 12-hour time, padded to 2                            | 01                                                          |
| H                |              | hour in 24-hour time, no padding                             | 9                                                           |
| HH               |              | hour in 24-hour time, padded to 2                            | 13                                                          |
| Z                |              | narrow offset                                                | +5                                                          |
| ZZ               |              | short offset                                                 | +05:00                                                      |
| ZZZ              |              | techie offset                                                | +0500                                                       |
| ZZZZ             |              | abbreviated named offset                                     | EST                                                         |
| ZZZZZ            |              | unabbreviated named offset                                   | Eastern Standard Time                                       |
| z                |              | IANA zone                                                    | America/New_York                                            |
| a                |              | meridiem                                                     | AM                                                          |
| d                |              | day of the month, no padding                                 | 6                                                           |
| dd               |              | day of the month, padded to 2                                | 06                                                          |
| c                | E            | day of the week, as number from 1-7 (Monday is 1, Sunday is 7) | 3                                                           |
| ccc              | EEE          | day of the week, as an abbreviate localized string           | Wed                                                         |
| cccc             | EEEE         | day of the week, as an unabbreviated localized string        | Wednesday                                                   |
| ccccc            | EEEEE        | day of the week, as a single localized letter                | W                                                           |
| L                | M            | month as an unpadded number                                  | 8                                                           |
| LL               | MM           | month as an padded number                                    | 08                                                          |
| LLL              | MMM          | month as an abbreviated localized string                     | Aug                                                         |
| LLLL             | MMMM         | month as an unabbreviated localized string                   | August                                                      |
| LLLLL            | MMMMM        | month as a single localized letter                           | A                                                           |
| y                |              | year, unpadded                                               | 2014                                                        |
| yy               |              | two-digit year                                               | 14                                                          |
| yyyy             |              | four- to six- digit year, pads to 4                          | 2014                                                        |
| G                |              | abbreviated localized era                                    | AD                                                          |
| GG               |              | unabbreviated localized era                                  | Anno Domini                                                 |
| GGGGG            |              | one-letter localized era                                     | A                                                           |
| kk               |              | ISO week year, unpadded                                      | 17                                                          |
| kkkk             |              | ISO week year, padded to 4                                   | 2014                                                        |
| W                |              | ISO week number, unpadded                                    | 32                                                          |
| WW               |              | ISO week number, padded to 2                                 | 32                                                          |
| o                |              | ordinal (day of year), unpadded                              | 218                                                         |
| ooo              |              | ordinal (day of year), padded to 3                           | 218                                                         |
| D                |              | localized numeric date                                       | 9/4/2017                                                    |
| DD               |              | localized date with abbreviated month                        | Aug 6, 2014                                                 |
| DDD              |              | localized date with full month                               | August 6, 2014                                              |
| DDDD             |              | localized date with full month and weekday                   | Wednesday, August 6, 2014                                   |
| t                |              | localized time                                               | 9:07 AM                                                     |
| tt               |              | localized time with seconds                                  | 1:07:04 PM                                                  |
| ttt              |              | localized time with seconds and abbreviated offset           | 1:07:04 PM EDT                                              |
| tttt             |              | localized time with seconds and full offset                  | 1:07:04 PM Eastern Daylight Time                            |
| T                |              | localized 24-hour time                                       | 13:07                                                       |
| TT               |              | localized 24-hour time with seconds                          | 13:07:04                                                    |
| TTT              |              | localized 24-hour time with seconds and abbreviated offset   | 13:07:04 EDT                                                |
| TTTT             |              | localized 24-hour time with seconds and full offset          | 13:07:04 Eastern Daylight Time                              |
| f                |              | short localized date and time                                | 8/6/2014, 1:07 PM                                           |
| ff               |              | less short localized date and time                           | Aug 6, 2014, 1:07 PM                                        |
| fff              |              | verbose localized date and time                              | August 6, 2014, 1:07 PM EDT                                 |
| ffff             |              | extra verbose localized date and time                        | Wednesday, August 6, 2014, 1:07 PM Eastern Daylight Time    |
| F                |              | short localized date and time with seconds                   | 8/6/2014, 1:07:04 PM                                        |
| FF               |              | less short localized date and time with seconds              | Aug 6, 2014, 1:07:04 PM                                     |
| FFF              |              | verbose localized date and time with seconds                 | August 6, 2014, 1:07:04 PM EDT                              |
| FFFF             |              | extra verbose localized date and time with seconds           | Wednesday, August 6, 2014, 1:07:04 PM Eastern Daylight Time |
| q                |              | quarter, no padding                                          | 9                                                           |
| qq               |              | quarter, padded to 2                                         | 13                                                          |

Full list of tokens can be found [here](https://moment.github.io/luxon/#/formatting?id=table-of-tokens)
