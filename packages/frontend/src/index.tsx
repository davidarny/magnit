import React from "react";
import ReactDOM from "react-dom";
import { App } from "containers/app";
import * as ServiceWorker from "./ServiceWorker";
import { ThemeProvider } from "emotion-theming";
import { JssProvider } from "components/jss-provider";

// Allows <></> to be used
(global as typeof global & { React: typeof React }).React = React;

const theme = {
    fontSize: {
        small: "0.5rem",
        smaller: "0.75rem",
        normal: "1rem",
        larger: "1.5rem",
        large: "2rem",
    },
    spacing(times: number = 1) {
        return times * 8 + "px";
    },
};

ReactDOM.render(
    <JssProvider>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </JssProvider>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
ServiceWorker.unregister();
