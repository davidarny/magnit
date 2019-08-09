const path = require("path");
const os = require("os");
const webpack = require("webpack");
const externals = require("webpack-node-externals");

const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const PeerDepsExternalsPlugin = require("peer-deps-externals-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");

const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

const env = {
    get stringified() {
        return {
            "process.env": Object.keys(process.env).reduce((env, key) => {
                env[key] = JSON.stringify(process.env[key]);
                return env;
            }, {}),
        };
    },
};

const isDevelopment = process.env.NODE_ENV !== "production";
const isProduction = process.env.NODE_ENV === "production";

module.exports = smp.wrap({
    entry: {
        index: "./src/index.ts",
    },
    ...(isProduction ? {} : { devtool: "eval" }),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        library: "TemplateEditor",
        libraryTarget: "umd",
    },
    externals: [externals()],
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        modules: ["node_modules", "src"],
    },
    optimization: {
        minimize: isProduction,
        removeAvailableModules: isProduction,
        removeEmptyChunks: isProduction,
        splitChunks: isProduction && {},
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
        new CircularDependencyPlugin(),
        new webpack.DefinePlugin(env.stringified),
        new ForkTsCheckerWebpackPlugin({
            watch: isDevelopment && "./src",
            checkSyntacticErrors: true,
        }),
    ],
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
});
