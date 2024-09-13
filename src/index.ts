import type { App } from 'vue'

import type { ParseOptions } from './parse'
import type { InputOptions, LuxonOptions, OutputOptions } from './types'
import { defu } from 'defu'
import { DEFAULT_SETTINGS } from './constants'
import formatDt from './format'
import parse from './parse'

type ParseInput = string | number | Date
type FormatInputOptions = string | Partial<InputOptions>
type FormatOutputOptions = string | Partial<OutputOptions>

export default {
  install: (app: App, options: LuxonOptions = {}) => {
    const luxonOptions = defu(options, DEFAULT_SETTINGS) as Required<LuxonOptions>

    function extendInput(value: ParseInput, format?: FormatInputOptions): ParseOptions {
      let options = typeof format === 'string' ? { format } : format
      if (options === undefined) {
        options = {}
      }

      let template: Partial<InputOptions> | undefined

      if (typeof options.format === 'string' && options.format in luxonOptions.templates) {
        const { format: templateFormat, ...rest } = luxonOptions.templates[options.format as keyof typeof luxonOptions.templates]
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
        else {
          options.format = template?.format || luxonOptions.input.format
        }
      }

      options.zone = options.zone || template?.zone || luxonOptions.input.zone
      return { value, ...options } as ParseOptions
    }

    function extendOutput(format?: FormatOutputOptions): OutputOptions {
      if (!format) {
        format = luxonOptions.output
      }
      const base = typeof format === 'string' ? { format } : format

      let template: Partial<OutputOptions> | undefined

      if (typeof base.format === 'string' && base.format in luxonOptions.templates) {
        template = luxonOptions.templates[base.format as keyof typeof luxonOptions.templates] as Partial<OutputOptions>
      }

      const m = defu(template, base, luxonOptions.output)
      return m as OutputOptions
    }

    function luxonParse(value: ParseInput, format?: FormatInputOptions) {
      return parse(extendInput(value, format))
    }

    function luxonFormat(value: ParseInput, format?: FormatOutputOptions, inputFormat?: FormatInputOptions) {
      const dt = luxonParse(value, inputFormat)
      return formatDt(dt, extendOutput(format))
    }

    app.config.globalProperties.$lp = luxonParse
    app.config.globalProperties.$lf = luxonFormat
    app.config.globalProperties.$luxon = luxonFormat
  },
}
