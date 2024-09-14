import type { App } from 'vue'

import type { ParseOptions } from './parse'
import type { InputOptions, LuxOptions, OutputOptions } from './types'
import { defu } from 'defu'
import formatDateTime from './format'
import parseInput from './parse'

type ParseInput = string | number | Date
type FormatInputOptions = string | Partial<InputOptions>
type FormatOutputOptions = string | Partial<OutputOptions>

function extendInput(luxOptions: Required<LuxOptions>, value: ParseInput, format?: FormatInputOptions): ParseOptions {
  let options = typeof format === 'string' ? { format } : format
  if (options === undefined) {
    options = {}
  }

  let template: Partial<InputOptions> | undefined

  if (typeof options.format === 'string' && options.format in luxOptions.templates) {
    const { format: templateFormat, ...rest } = luxOptions.templates[options.format as keyof typeof luxOptions.templates]
    template = {
      ...rest,
      ...(templateFormat && typeof templateFormat === 'string' && { format: templateFormat }),
    }
  }

  if (!options.format) {
    if (value instanceof Date) {
      options.format = 'jsdate'
    }
    else if (typeof value === 'number') {
      options.format = 'millis'
    }
  }

  const opts = defu(template, options, luxOptions.input)
  return { value, ...opts } as ParseOptions
}

function extendOutput(luxOptions: Required<LuxOptions>, format?: FormatOutputOptions): OutputOptions {
  if (!format) {
    format = luxOptions.output
  }
  const base = typeof format === 'string' ? { format } : format

  let template: Partial<OutputOptions> | undefined

  if (typeof base.format === 'string' && base.format in luxOptions.templates) {
    template = luxOptions.templates[base.format as keyof typeof luxOptions.templates] as Partial<OutputOptions>
  }

  const opts = defu(template, base, luxOptions.output)
  return opts as OutputOptions
}

export function luxParse(luxOptions: Required<LuxOptions>) {
  return (value: ParseInput, format?: FormatInputOptions) => parseInput(extendInput(luxOptions, value, format))
}

export function luxFormat(luxOptions: Required<LuxOptions>) {
  const p = luxParse(luxOptions)
  return (value: ParseInput, format?: FormatOutputOptions, inputFormat?: FormatInputOptions) => {
    const dt = p(value, inputFormat)
    return formatDateTime(dt, extendOutput(luxOptions, format))
  }
}
