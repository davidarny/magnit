import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import sourcemaps from "rollup-plugin-sourcemaps";
import typescript from "rollup-plugin-typescript2";

const pkg = require("./package.json");

export default {
    input: "src/index.ts",
    output: [{ file: pkg.main, format: "cjs", sourcemap: true }],
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: Object.keys(pkg.peerDependencies),
    watch: { include: "src/**" },
    plugins: [
        // Compile TypeScript files
        typescript({
            rollupCommonJSResolveHack: true,
            cacheRoot: "./node_modules/.rts2_cache",
        }),
        // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
        commonjs({ include: /node_modules/ }),
        // Allow node_modules resolution, so you can use 'external' to control
        // which external modules to include in the bundle
        // https://github.com/rollup/rollup-plugin-node-resolve#usage
        resolve(),
        // Resolve source maps to the original source
        sourcemaps(),
    ],
};
