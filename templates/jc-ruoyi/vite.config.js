import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import createVitePlugins from './vite/plugins';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode, command }) => {
	const env = loadEnv(mode, process.cwd());
	const { VITE_APP_ENV } = env;
	const plugins = [
		createVitePlugins(env, command === 'build'),
		mode === 'analysis' && visualizer({ open: true, filename: 'dist/analysis.html' }),
	];
	return {
		base: VITE_APP_ENV === 'production' ? '/' : '/',
		plugins,
		resolve: {
			alias: {
				// 设置路径
				'~': path.resolve(__dirname, './'),
				// 设置别名
				'@': path.resolve(__dirname, './src'),
				// i18n打包问题
				'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
			},
			extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
		},
		// vite 相关配置
		server: {
			port: 90,
			host: true,
			open: true,
			proxy: {
				// https://cn.vitejs.dev/config/#server-proxy
				'/dev-api': {
					target: 'http://vue.ruoyi.vip/prod-api/',
					changeOrigin: true,
					rewrite: (p) => p.replace(/^\/dev-api/, ''),
				},
			},
		},
		build: {
			chunkSizeWarningLimit: 1600,
			target: 'esnext',
			outDir: '../../dist/',
		},
		css: {
			postcss: {
				plugins: [
					{
						postcssPlugin: 'internal:charset-removal',
						AtRule: {
							charset: (atRule) => {
								if (atRule.name === 'charset') {
									atRule.remove();
								}
							},
						},
					},
				],
			},
		},
	};
});
