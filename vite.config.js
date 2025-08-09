// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'
// import path from "path"
// import tailwindcss from '@tailwindcss/vite'
// import { splitVendorChunkPlugin } from 'vite'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(),
//     splitVendorChunkPlugin(),
//   ],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   build: {
//     // Generate source maps for production builds
//     sourcemap: false,
//     // Minify output
//     minify: 'terser',
//     // Terser options
//     terserOptions: {
//       compress: {
//         drop_console: true,
//         drop_debugger: true,
//       },
//     },
//     // Chunk size warning limit
//     chunkSizeWarningLimit: 800,
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           vendor: [
//             'react', 
//             'react-dom',
//             'react-hot-toast'
//           ],
//           animations: [
//             'framer-motion'
//           ]
//         }
//       }
//     }
//   },
//   server: {
//     // Configure server for better performance during development
//     hmr: {
//       overlay: true,
//     },
//     open: true,
//   },
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import tailwindcss from '@tailwindcss/vite'
import { splitVendorChunkPlugin } from 'vite'

export default defineConfig({
  base: '/', // Ensures correct paths when deployed on Netlify
  plugins: [
    react(),
    tailwindcss(),
    splitVendorChunkPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist', // Netlify will use this folder
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react', 
            'react-dom',
            'react-hot-toast'
          ],
          animations: [
            'framer-motion'
          ]
        }
      }
    }
  },
  server: {
    hmr: {
      overlay: true,
    },
    open: true,
  },
})
