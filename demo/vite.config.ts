import path from 'path'
import {defineConfig} from 'vite'
import mdSan from 'vite-plugin-md-san'

// https://vitejs.dev/config/
export default defineConfig({
  root: path.resolve(process.cwd(), 'demo'),
  plugins: [mdSan({})]
})
