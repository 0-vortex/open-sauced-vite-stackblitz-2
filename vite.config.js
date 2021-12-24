import { defineConfig } from 'vite'
import ViteReact from '@vitejs/plugin-react'
import ViteEslint from '@nabla/vite-plugin-eslint'
import ViteHtml from 'vite-plugin-html'
import ViteLegacy from '@vitejs/plugin-legacy'

// https://vitejs.dev/config/
export default defineConfig(({command, mode, ...rest }) => {
  // figure out commands
  const isBuild = command === 'build';

  // figure out modes
  const isDev = mode === "development";
  const isProd = mode === "production";
  const isReport = mode === "report";

  // figure out custom build options
  const isLegacy = process.env.VITE_LEGACY || false;
  const isGitpodBuild = process.env.GITPOD_WORKSPACE_URL || false;

  const build = {
    outDir: "build",
    assetsDir: "static",
    sourcemap: !isDev,
    rollupOptions: {},
    manifest: false,
  };

  const plugins = [
    ViteEslint(),
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
      minify: isProd && isBuild,
      inject: {
        data: {
          title: `Open Sauced v${process.env.npm_package_version}`,
        },
      },
    })
  ];

  // broken until we figure out how to automate it w/wo workbox
  // isProd && (build.manifest = true);

  isBuild && isLegacy && plugins.push(
    ViteLegacy({
      targets: [
        'defaults',
        'not IE 11'
      ]
    })
  );

  return {
    base: "/",
    mode,
    plugins,
    publicDir: "public",
    server: {
      port: 3000,
      open: !isGitpodBuild,
    },
    build,
    preview: {
      port: 3000,
    }
  };
});
