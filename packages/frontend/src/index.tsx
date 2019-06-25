/** @jsx jsx */

import { jsx } from "@emotion/core";
import ReactDOM from "react-dom";
import { App } from "containers/app";
import * as ServiceWorker from "./ServiceWorker";
import { ThemeProvider } from "emotion-theming";
import { JssProvider } from "components/jss-provider";

const theme = {
    fontSize: {
        small: "0.7em",
        smaller: "0.75em",
        normal: "1em",
        larger: "1.25em",
        large: "1.5em",
        xLarge: "1.75em",
        xxLarge: "2em",
    },

    maxTemplateWidth: "1280px",

    spacing(times: number = 1) {
        return times * 8 + "px";
    },

    radius(times: number = 1) {
        return times * 8 + "px";
    },

    colors: {
        primary: "#2F97FF",
        secondary: "#8A94A2",
        default: "#000000",
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
