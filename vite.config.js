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
  const isCodeSandboxBuild = process.env.CODESANDBOX_SSE || false;
  const isCloudIdeBuild = isGitpodBuild || isCodeSandboxBuild;

  const config = {
    base: "/",
    mode,
    plugins: [],
    publicDir: "public",
    server: {
      host: true,
      port: 3000,
      strictPort: true,
      open: !isCloudIdeBuild,
    },
    build: {
      outDir: "build",
      assetsDir: "static",
      sourcemap: !isDev,
      rollupOptions: {},
      manifest: false,
    },
    preview: {
      port: 3000,
    }
  };

  // config.plugins.push(ViteEslint());

  config.plugins.push(
    ViteReact({
      // fastRefresh: !(isCodeSandboxBuild || process.env.NODE_ENV === 'test'),
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
    })
  );

  // config.plugins.push(
  //   ViteHtml({
  //     minify: isProd && isBuild,
  //     inject: {
  //       data: {
  //         title: `Open Sauced v${process.env.npm_package_version}`,
  //       },
  //     },
  //   })
  // );
  //
  // isBuild && isLegacy && config.plugins.push(
  //   ViteLegacy({
  //     targets: [
  //       'defaults',
  //       'not IE 11'
  //     ]
  //   })
  // );

  // cloud container specific build options
  isCloudIdeBuild && (config.server.hmr = {
    port: 443,
  });

  return {
    // base: "/",
    // mode,
    // publicDir: "public",
    plugins: config.plugins,
    server: {
      host: true,
      // https: true,
      // port: 3000,
      hmr: {
        port: 443,
      },
    }
  }
  return config;
});
