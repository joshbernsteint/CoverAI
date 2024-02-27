import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';

import nodePolyfills from 'rollup-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills(), ],
})
