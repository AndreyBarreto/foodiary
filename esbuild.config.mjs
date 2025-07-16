import esbuildPluginTsc from "esbuild-plugin-tsc";

export default () => ({
    bundle: true,
    minify: true,
    sourcemap: false,
    exclude: ["@aws-sdk/*"],
    external: ["@aws-sdk/*"],
    plugins: [esbuildPluginTsc()],
    platform: "node",
    target: "node22",
    format: "cjs",
})
