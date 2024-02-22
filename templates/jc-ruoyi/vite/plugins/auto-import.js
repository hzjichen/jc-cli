import autoImport from "unplugin-auto-import/vite";

export default function createAutoImport() {
	return autoImport({
		// 注册并使用配置项
		include: [
			/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
			/\.vue$/,
			/\.vue\?vue/, // .vue
			/\.md$/, // .md
		],
		imports: ["vue", "vue-router", "pinia"],
		dts: "src/auto-import.d.ts", // 路径下自动生成文件夹存放全局指令
		eslintrc: {
			enabled: true,
		},
	});
}
