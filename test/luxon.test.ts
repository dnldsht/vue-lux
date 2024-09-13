import type { LuxonOptions } from '../src/types'
import { DateTime } from 'luxon'
import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import plugin from '../src/index'

function initApp(options: LuxonOptions = {}) {
  const app = createApp({})
  app.use(plugin, options)
  return app
}

describe('plugin', () => {
  it('should install the plugin', () => {
    const app = initApp()

    expect(app.config.globalProperties.$luxon).toBeDefined()
    expect(app.config.globalProperties.$lp).toBeDefined()
    expect(app.config.globalProperties.$lf).toBeDefined()
  })
})

describe('datetimes', () => {
  it('format', () => {
    const app = initApp({
      output: {
        zone: 'utc',
      },
    })

    const $luxon = app.config.globalProperties.$luxon
    const date = '2024-07-12T12:23:49.000Z'
    const outputs = [
      { format: undefined, expected: '7/12/2024, 12:23 PM' },
      { format: 'full', expected: 'July 12, 2024 at 12:23 PM UTC' },
      { format: 'fulls', expected: 'July 12, 2024 at 12:23:49 PM UTC' },
      { format: 'huge', expected: 'Friday, July 12, 2024 at 12:23 PM UTC' },
      { format: 'huges', expected: 'Friday, July 12, 2024 at 12:23:49 PM UTC' },
      { format: 'med', expected: 'Jul 12, 2024, 12:23 PM' },
      { format: 'meds', expected: 'Jul 12, 2024, 12:23:49 PM' },
      { format: 'short', expected: '7/12/2024, 12:23 PM' },
      { format: 'shorts', expected: '7/12/2024, 12:23:49 PM' },
      { format: 'date_full', expected: 'July 12, 2024' },
      { format: 'date_huge', expected: 'Friday, July 12, 2024' },
      { format: 'date_med', expected: 'Jul 12, 2024' },
      { format: 'date_medd', expected: 'Fri, Jul 12, 2024' },
      { format: 'date_short', expected: '7/12/2024' },
      { format: 'time24', expected: '12:23' },
      { format: 'time24longoffset', expected: '12:23:49 UTC' },
      { format: 'time24s', expected: '12:23:49' },
      { format: 'time', expected: '12:23 PM' },
      { format: 'times', expected: '12:23:49 PM' },
      { format: 'iso', expected: '2024-07-12T12:23:49.000Z' },
      { format: 'sql', expected: '2024-07-12 12:23:49.000 Z' },
      { format: 'http', expected: 'Fri, 12 Jul 2024 12:23:49 GMT' },
      { format: 'rfc', expected: 'Fri, 12 Jul 2024 12:23:49 +0000' },
      { format: 'rfc2822', expected: 'Fri, 12 Jul 2024 12:23:49 +0000' },
      { format: 'millis', expected: 1720787029000 },
      { format: 'unix', expected: 1720787029 },
      { format: 'seconds', expected: 1720787029 },
    ]

    for (const { format, expected } of outputs) {
      expect($luxon(date, format), format).toBe(expected)
    }

    expect($luxon(date, 'jsdate').getTime()).toBe(new Date(1720787029 * 1000).getTime())
    expect($luxon(date, 'relative')).toMatch('ago')
    expect(() => $luxon(date, { format: 1 })).toThrowError(TypeError)
  })

  it('format with locale', () => {
    const app = initApp({
      output: {
        zone: 'utc',
        locale: 'it',
      },
    })

    const $luxon = app.config.globalProperties.$luxon
    const date = '2024-07-12T12:23:49.000Z'
    const outputs = [
      { format: 'full', expected: '12 luglio 2024 alle ore 12:23 UTC' },
      { format: 'fulls', expected: '12 luglio 2024 alle ore 12:23:49 UTC' },
      { format: 'huge', expected: 'venerdì 12 luglio 2024 alle ore 12:23 UTC' },
      {
        format: 'huges',
        expected: 'venerdì 12 luglio 2024 alle ore 12:23:49 UTC',
      },
      { format: 'med', expected: '12 lug 2024, 12:23' },
      { format: 'meds', expected: '12 lug 2024, 12:23:49' },
      { format: 'short', expected: '12/07/2024, 12:23' },
      { format: 'shorts', expected: '12/07/2024, 12:23:49' },
      { format: 'date_full', expected: '12 luglio 2024' },
      { format: 'date_huge', expected: 'venerdì 12 luglio 2024' },
      { format: 'date_med', expected: '12 lug 2024' },
      { format: 'date_medd', expected: 'ven 12 lug 2024' },
      { format: 'date_short', expected: '12/07/2024' },
      { format: 'time24', expected: '12:23' },
      { format: 'time24longoffset', expected: '12:23:49 UTC' },
      { format: 'time24s', expected: '12:23:49' },
      { format: 'time', expected: '12:23' },
      { format: 'times', expected: '12:23:49' },
    ]

    for (const { format, expected } of outputs) {
      expect($luxon(date, format), format).toBe(expected)
    }
  })

  it('format with timezones', () => {
    const app = initApp({
      output: {
        zone: 'America/New_York',
      },
    })

    const $luxon = app.config.globalProperties.$luxon
    const date = '2024-07-12T12:23:49.000Z'
    const outputs = [
      { format: undefined, expected: '7/12/2024, 8:23 AM' },
      { format: 'full', expected: 'July 12, 2024 at 8:23 AM EDT' },
      { format: 'fulls', expected: 'July 12, 2024 at 8:23:49 AM EDT' },
      { format: 'huge', expected: 'Friday, July 12, 2024 at 8:23 AM Eastern Daylight Time' },
      { format: 'huges', expected: 'Friday, July 12, 2024 at 8:23:49 AM Eastern Daylight Time' },
      { format: 'med', expected: 'Jul 12, 2024, 8:23 AM' },
      { format: 'meds', expected: 'Jul 12, 2024, 8:23:49 AM' },
      { format: 'short', expected: '7/12/2024, 8:23 AM' },
      { format: 'shorts', expected: '7/12/2024, 8:23:49 AM' },
      { format: 'time24', expected: '08:23' },
      { format: 'time24longoffset', expected: '08:23:49 Eastern Daylight Time' },
      { format: 'time24s', expected: '08:23:49' },
      { format: 'time', expected: '8:23 AM' },
      { format: 'times', expected: '8:23:49 AM' },
    ]

    for (const { format, expected } of outputs) {
      expect($luxon(date, format), format).toMatch(expected)
    }

    const dateIn = '2024-07-12T12:23:49'
    const zoneIn = 'Asia/Tokyo'
    const zoneOut = 'Europe/Rome'

    expect($luxon(dateIn, { format: 'huges', zone: zoneOut }, { zone: zoneIn })).toMatch('Friday, July 12, 2024 at 5:23:49 AM Central European Summer Time')
  })

  it('format with templates', () => {
    const app = initApp({
      templates: {
        date: { format: 'dd/MM/yyyy' },
      },
    })

    const $luxon = app.config.globalProperties.$luxon
    const date = '2024-07-12T12:23:49.000Z'
    const outputs = [{ format: 'date', expected: '12/07/2024' }]

    for (const { format, expected } of outputs) {
      expect($luxon(date, format)).toBe(expected)
    }
  })
})

describe('parse', () => {
  it('inputs', () => {
    const app = initApp({
      templates: {
        my_template: { format: 'dd-MM--yyyy' },
      },
    })
    const $lp = app.config.globalProperties.$lp

    const date = '2024-07-12'
    expect($lp('12/07/2024', 'dd/MM/yyyy').toISODate()).toBe(date)
    expect($lp('12/07/2024', { format: 'dd/MM/yyyy' }).toISODate()).toBe(date)
    expect($lp('12-07--2024', { format: 'my_template' }).toISODate()).toBe(date)
    expect($lp(new Date(2024, 6, 13)).toISODate()).toBe(date)
    expect($lp(1720742400 * 1000).toISODate()).toBe(date)
    expect($lp(DateTime.fromObject({ year: 2024, month: 7, day: 13 })).toISODate()).toBe(date)

    const formats = [
      { format: 'iso', value: '2024-07-12' },
      { format: 'sql', value: '2024-07-12' },
      { format: 'http', value: 'Fri, 12 Jul 2024 12:23:49 GMT' },
      { format: 'rfc2822', value: 'Fri, 12 Jul 2024 12:23:49 +0000' },
      { format: 'millis', value: 1720787029000 },
      { format: 'unix', value: 1720787029 },
      { format: 'seconds', value: 1720787029 },
      { format: 'luxon', value: DateTime.fromObject({ year: 2024, month: 7, day: 13 }) },
    ]

    expect(() => $lp('2024-07-12', { format: 'jsdate' })).toThrowError(TypeError)
    expect(() => $lp(null, { format: 'jsdate' })).toThrowError(TypeError)

    expect(() => $lp('2024-07-12', { format: 'millis' })).toThrowError(TypeError)
    expect(() => $lp(null, { format: 'millis' })).toThrowError(TypeError)

    expect(() => $lp('2024-07-12', { format: 'seconds' })).toThrowError(TypeError)
    expect(() => $lp(null, { format: 'seconds' })).toThrowError(TypeError)

    expect(() => $lp('2024-07-12', { format: 0 })).toThrowError(TypeError)
    expect(() => $lp(0, { format: 'short' })).toThrowError(TypeError)
    expect(() => $lp(null, { format: 'short' })).toThrowError(TypeError)

    for (const { format, value } of formats) {
      expect($lp(value, { format }).toISODate(), format).toBe(date)
    }
  })
})

describe('dates', () => {
  it('simple dates utc', () => {
    const app = initApp({
      output: {
        zone: 'utc',
        locale: 'it',
      },
    })

    const $luxon = app.config.globalProperties.$luxon
    const date = '2024-07-12'
    const outputs = [
      { format: 'date_short', expected: '12/07/2024' },
      { format: 'short', expected: '12/07/2024, 00:00' },
    ]

    for (const { format, expected } of outputs) {
      expect($luxon(date, format)).toBe(expected)
    }
  })
})

describe('times', () => {
  it('simple utc', () => {
    const app = initApp({
      output: {
        zone: 'utc',
        locale: 'it',
      },
    })

    const $luxon = app.config.globalProperties.$luxon
    const date = '16:20:00'
    const today = $luxon(new Date(), 'date_short')

    const outputs = [
      { format: 'time', expected: '16:20' },
      { format: 'short', expected: `${today}, 16:20` },
    ]

    for (const { format, expected } of outputs) {
      expect($luxon(date, format)).toBe(expected)
    }
  })
})
