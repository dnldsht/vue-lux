import type { Zone } from 'luxon'
import { DateTime } from 'luxon'

interface LuxonParseOptions {
  value: DateTime
  format: 'luxon'
  zone?: string | Zone
}

interface JsDateParseOptions {
  value: Date
  format: 'jsdate'
  zone?: string | Zone
}

interface NumberParseOptions {
  value: number
  format: 'millis' | 'seconds' | 'unix'
  zone?: string | Zone
}

interface StringParseOptions {
  value: string
  format: 'sql' | 'iso' | 'http' | 'rfc2822' | string
  zone?: string | Zone
}

export type ParseOptions = StringParseOptions | NumberParseOptions | JsDateParseOptions | LuxonParseOptions

export default function parse(options: ParseOptions): DateTime {
  const { value, format, zone } = options

  switch (format) {
    case 'sql':
      return DateTime.fromSQL(value, { zone })
    case 'iso':
      return DateTime.fromISO(value, { zone })
    case 'http':
      return DateTime.fromHTTP(value, { zone })
    case 'jsdate':
      if (!(value instanceof Date)) {
        throw new TypeError(`Value must be an instance of Date, received ${value === null ? 'null' : typeof value}`)
      }
      return DateTime.fromJSDate(value, { zone })
    case 'luxon':
      return (value as DateTime).setZone(zone)
    case 'rfc2822':
      return DateTime.fromRFC2822(value, { zone })
    case 'millis':
      if (typeof value !== 'number') {
        throw new TypeError(`Value must be an integer, received ${value === null ? 'null' : typeof value}`)
      }
      return DateTime.fromMillis(value, { zone })
    case 'seconds':
    case 'unix':
      if (typeof value !== 'number') {
        throw new TypeError(`Value must be an integer, received ${value === null ? 'null' : typeof value}`)
      }
      return DateTime.fromSeconds(value, { zone })
    default:
      if (typeof format !== 'string') {
        throw new TypeError(`Invalid format argument: ${format} must be a string`)
      }
      if (typeof value !== 'string') {
        throw new TypeError(`Value must be a string, received ${value === null ? 'null' : typeof value}`)
      }
      return DateTime.fromFormat(value, format, { zone })
  }
}
