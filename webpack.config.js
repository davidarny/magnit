const path = require("path");
const os = require("os");
const webpack = require("webpack");

const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const PeerDepsExternalsPlugin = require("peer-deps-externals-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

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

const config = props => ({
    entry: {
        index: "./src/index.ts",
    },
    ...(production ? {} : process.env.SOURCE_MAPS !== "false" ? { devtool: "eval-sourcemap" } : {}),
    output: {
        path: path.resolve(props.dirname, "dist"),
        filename: "[name].js",
        library: props.library,
        libraryTarget: "umd",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        modules: ["node_modules", "src"],
        plugins: [new TsconfigPathsPlugin()],
    },
    stats: {
        assetsSort: "size",
        chunksSort: "size",
        modulesSort: "size",
    },
    optimization: {
        minimize: production,
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
            }),
        ],
        removeAvailableModules: production,
        removeEmptyChunks: production,
        splitChunks: production && { chunks: "all" },
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                include: path.resolve(props.dirname, "src"),
                exclude: /node_modules/,
                use: [
                    {
                        loader: "thread-loader",
                        options: { workers: os.cpus().length - 1 },
                    },
                    "babel-loader",
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
        new DuplicatePackageCheckerPlugin({
            verbose: true,
            strict: true,
        }),
        process.env.ANALYZE_BUNDLE === "true" && new BundleAnalyzerPlugin(),
        new webpack.DefinePlugin(env.stringified),
        new ForkTsCheckerWebpackPlugin({
            watch: development && "./src",
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
});

if (production) {
    module.exports = props => smp.wrap(config(props));
} else {
    module.exports = props => config(props);
}
