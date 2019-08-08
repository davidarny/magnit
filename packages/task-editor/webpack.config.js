const path = require("path");
const os = require("os");
const webpack = require("webpack");
const externals = require("webpack-node-externals");

const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const PeerDepsExternalsPlugin = require("peer-deps-externals-webpack-plugin");

const env = {
    raw: {
        NODE_ENV: process.env.NODE_ENV || "development",
    },
    get stringified() {
        return {
            "process.env": Object.keys(this.raw).reduce((env, key) => {
                env[key] = JSON.stringify(this.raw[key]);
                return env;
            }, {}),
        };
    },
};

const isDevelopment = process.env.NODE_ENV !== "production";
const isProduction = process.env.NODE_ENV === "production";
const fastBuildEnabled = !!process.env.FAST_BUILD_ENABLED;

module.exports = {
    entry: {
        index: "./src/index.ts",
    },
    ...(fastBuildEnabled || isProduction ? {} : { devtool: "eval" }),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        library: "TaskEditor",
        libraryTarget: "umd",
    },
    externals: [externals()],
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        modules: ["node_modules", "src"],
    },
    optimization: {
        minimize: isProduction && !fastBuildEnabled,
        removeAvailableModules: isProduction && !fastBuildEnabled,
        removeEmptyChunks: isProduction && !fastBuildEnabled,
        splitChunks: isProduction && !fastBuildEnabled && {},
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                include: path.resolve(__dirname, "src"),
                exclude: /node_modules/,
                use: [
                    {
                        loader: "thread-loader",
                        options: {
                            workers: os.cpus().length - 1,
                            poolTime: Infinity,
                        },
                    },
                    {
                        loader: "babel-loader",
                    },
                    {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true,
                            happyPackMode: true,
                            experimentalWatchApi: true,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HardSourceWebpackPlugin(),
        new PeerDepsExternalsPlugin(),
        new webpack.DefinePlugin(env.stringified),
        !fastBuildEnabled &&
            new ForkTsCheckerWebpackPlugin({
                watch: isDevelopment && "./src",
                checkSyntacticErrors: true,
            }),
    ].filter(Boolean),
    node: {
        dgram: "empty",
        fs: "empty",
        net: "empty",
        tls: "empty",
        child_process: "empty",
    },
    performance: {
        hints: false,
    },
};
