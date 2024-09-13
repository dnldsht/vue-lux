import type { DateTimeFormatOptions, ToISOTimeOptions, ToRelativeOptions, ToSQLOptions, Zone } from 'luxon'

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

export interface LuxonOptions {
  templates?: Record<string, OutputOptions>
  input?: InputOptions
  output?: OutputOptions
}
