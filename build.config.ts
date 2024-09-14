import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  externals: ['vue', 'luxon', 'defu', '@nuxt/kit', '@nuxt/schema'],
  entries: [
    './src/index',
    './src/nuxt',
  ],
  declaration: true,
})
