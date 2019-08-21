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

const development = process.env.NODE_ENV !== "production";
const production = process.env.NODE_ENV === "production";

const config = {
    entry: {
        index: "./src/index.ts",
    },
    ...(production ? {} : { devtool: "eval-source-map" }),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        library: "Services",
        libraryTarget: "umd",
    },
    externals: [externals()],
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        modules: ["node_modules", "src"],
    },
    optimization: {
        minimize: production,
        removeAvailableModules: production,
        removeEmptyChunks: production,
        splitChunks: production && {},
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
        new ForkTsCheckerWebpackPlugin({
            watch: development && "./src",
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
};

if (production) {
    module.exports = smp.wrap(config);
} else {
    module.exports = config;
}
