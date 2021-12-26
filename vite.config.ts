import { defineConfig } from 'vite'
import ViteReact from '@vitejs/plugin-react'
import ViteEslint from '@nabla/vite-plugin-eslint'
import ViteHtml from 'vite-plugin-html'
import ViteLegacy from '@vitejs/plugin-legacy'
import { sync } from 'execa'
import type { ConfigEnv, UserConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({command, mode, ...rest }: ConfigEnv): UserConfig => {
  // figure out commands
  const isBuild = command === 'build';

  // figure out modes
  const isDev = mode === "development";
  const isProd = mode === "production";
  const isReport = mode === "report";

  // figure out custom build options
  const isLegacy = process.env.VITE_LEGACY || false;
  const isGitpodBuild = process.env.GITPOD_WORKSPACE_URL || false;
  const isStackblitzBuild = process.env.STACKBLITZ_ENV || false;
  const isCodeSandboxBuild = process.env.CODESANDBOX_SSE || false;
  const isCloudIdeBuild = isGitpodBuild || isCodeSandboxBuild || isStackblitzBuild;

  const config:UserConfig = {
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

  config.plugins.push(ViteEslint());

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

  config.plugins.push(
    ViteHtml({
      minify: isProd && isBuild,
      inject: {
        data: {
          title: `Open Sauced v${process.env.npm_package_version}`,
        },
      },
    })
  );

  isBuild && isLegacy && config.plugins.push(
    ViteLegacy({
      targets: [
        'defaults',
        'not IE 11'
      ]
    })
  );

  // cloud container specific build options
  if (isStackblitzBuild) {
    const { stdout } = sync("hostname");
    config.base = `https://${stdout}--${config.server.port}.local.webcontainer.io`;
  }

  if (isCodeSandboxBuild) {
    const [type, sendbox, id] = process.env.HOSTNAME.split('-');
    config.base = `https://${id}.${type}.code${sendbox}.io`;
  }

  isCloudIdeBuild && (config.server.hmr = {
    port: 443,
  });

  return config;
});
