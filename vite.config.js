import { defineConfig } from 'vite'
import ViteReact from '@vitejs/plugin-react'
import ViteHtml from 'vite-plugin-html'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    ViteReact({
      fastRefresh: process.env.NODE_ENV !== 'test',
      // Exclude storybook stories
      exclude: /\.stories\.(t|j)sx?$/,
      // Only .jsx files
      include: "**/*.jsx",
      babel: {
        plugins: [
          [
            'babel-plugin-styled-components',
            {
              displayName: true,
              fileName: false
            }
          ]
        ]
      }
    }),
    ViteHtml({
      minify: false,
      inject: {
        data: {
          title: `Open Sauced v${process.env.npm_package_version}`,
        },
      },
    })
  ]
})
