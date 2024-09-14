import type { LuxOptions } from './types'
import { addPluginTemplate, defineNuxtModule } from '@nuxt/kit'
import defu from 'defu'
import { DEFAULT_OPTIONS } from './config'

export default defineNuxtModule<LuxOptions>({
  meta: {
    name: 'nuxt-lux',
    configKey: 'lux',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: DEFAULT_OPTIONS,
  setup(luxOptions, nuxt) {
    nuxt.options.runtimeConfig.public.lux = defu(
      nuxt.options.runtimeConfig.public.lux || {},
      luxOptions,
    )

    addPluginTemplate({
      filename: '001.lux.client.mjs',
      getContents() {
        return `
          import VueLux from 'vue-lux'
          import { defineNuxtPlugin, useRuntimeConfig } from '#imports'

          export default defineNuxtPlugin((nuxtApp) => {
            const options = useRuntimeConfig().public?.lux || {}
            nuxtApp.vueApp.use(VueLux, options)
          })
            `
      },
    })
  },
})
