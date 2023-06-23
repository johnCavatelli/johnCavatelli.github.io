import { defineConfig, loadEnv } from 'vite'

export default defineConfig({
  assetsInclude: ['**/*.frag',"/resource/shader.frag"],
  build: {
    target: 'esnext'
  },
})

// export default defineConfig(({ command, mode }) => {
//   // Load env file based on `mode` in the current working directory.
//   // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
//   const env = loadEnv(mode, process.cwd(), '')
//   return {
//     // vite config
//     define: {
//       __APP_ENV__: env.APP_ENV,
//     },
//     build: {
//         target: 'esnext'
//     },
//     assetsInclude: ['**/*.frag','**/orbit_regular.json'],
//   }
// })