import type { DateTime, DateTimeFormatOptions, ToISOTimeOptions, ToRelativeOptions, ToSQLOptions, Zone } from 'luxon'

export interface InputOptions {
  zone?: string | Zone
  format: string
}

export interface OutputOptions {
  zone?: string | Zone
  locale?: string
  format?: string | DateTimeFormatOptions | Intl.DateTimeFormatOptions
  relative?: ToRelativeOptions
  sql?: ToSQLOptions
  iso?: ToISOTimeOptions
}

export interface LuxOptions {
  templates?: Record<string, OutputOptions>
  input?: InputOptions
  output?: OutputOptions
}

type ParseInput = string | number | Date | DateTime
type FormatInputOptions = string | Partial<InputOptions>
type FormatOutputOptions = string | Partial<OutputOptions>

declare module '@nuxt/schema' {
  interface NuxtConfig {
    ['lux']?: LuxOptions
  }
  interface NuxtOptions {
    ['lux']?: LuxOptions
  }
}

declare module 'nuxt/schema' {
  interface NuxtConfig {
    ['lux']?: LuxOptions
  }
  interface NuxtOptions {
    ['lux']?: LuxOptions
  }
}

declare module '#app' {
  interface NuxtApp {
    $lux: (value: ParseInput, format?: FormatOutputOptions, inputFormat?: FormatInputOptions) => string | number | Date | null
    $lp: (value: ParseInput, format?: FormatInputOptions) => DateTime
    $lf: (value: ParseInput, format?: FormatOutputOptions, inputFormat?: FormatInputOptions) => string | number | Date | null
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $lux: (value: ParseInput, format?: FormatOutputOptions, inputFormat?: FormatInputOptions) => string | number | Date | null
    $lp: (value: ParseInput, format?: FormatInputOptions) => DateTime
    $lf: (value: ParseInput, format?: FormatOutputOptions, inputFormat?: FormatInputOptions) => string | number | Date | null
  }
}
