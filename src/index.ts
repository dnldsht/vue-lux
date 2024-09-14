import type { App } from 'vue'

import type { LuxOptions } from './types'
import { defu } from 'defu'
import { DEFAULT_OPTIONS } from './config'
import { luxFormat, luxParse } from './utils'

export default {
  install: (app: App, options: LuxOptions = {}) => {
    const luxOptions = defu(options, DEFAULT_OPTIONS) as Required<LuxOptions>

    app.config.globalProperties.$lp = luxParse(luxOptions)
    app.config.globalProperties.$lf = luxFormat(luxOptions)
    app.config.globalProperties.$luxon = luxFormat(luxOptions)
  },
}
