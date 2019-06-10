import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import sourcemaps from "rollup-plugin-sourcemaps";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import { sizeSnapshot } from "rollup-plugin-size-snapshot";

const pkg = require("./package.json");

export default {
    input: "src/index.ts",
    output: [
        {
            file: pkg.main,
            format: "cjs",
            sourcemap: true,
        },
    ],
    external: Object.keys(pkg.peerDependencies),
    watch: {
        include: "src/**",
    },
    treeshake: process.env.NODE_ENV === "production",
    plugins: [
        typescript({
            rollupCommonJSResolveHack: true,
            cacheRoot: "./node_modules/.rts2_cache",
        }),
        commonjs({
            include: /node_modules/,
        }),
        resolve({
            NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development"),
        }),
        sourcemaps(),
        sizeSnapshot({
            snapshotPath: "./node_modules/.size-snapshot.json",
        }),
        process.env.NODE_ENV === "production" &&
            terser({
                toplevel: true,
            }),
    ],
    onwarn: message => {
        if (/crypto/.test(message)) return;
        console.error(message);
    },
};
