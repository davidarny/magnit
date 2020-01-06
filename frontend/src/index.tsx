/** @jsx jsx */

import { jsx } from "@emotion/core";
import { JssProvider } from "components/jss-provider";
import { App } from "containers/app";
import { ThemeProvider } from "emotion-theming";
import ReactDOM from "react-dom";
import * as ServiceWorker from "./ServiceWorker";

const theme = {
    fontSize: {
        small: "0.7em",
        smaller: "0.75em",
        xsNormal: "0.8em",
        sNormal: "0.85em",
        mNormal: "0.925em",
        normal: "1em",
        medium: "1.15em",
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
        darkPrimary: "#207BD6",
        primary: "#2F97FF",
        secondary: "#8A94A2",
        default: "#000000",
        black: "#3F4752",
        light: "#F6F7FB",
        shadowGray: "#BFC8D2",
        shadowBlue: "#2D96FF",
        gray: "#AAB4BE",
        lightGray: "#DEE5EF",
        green: "#0CDAAC",
        darkGreen: "#1EC9A3",
        lightBlue: "#ECF6FF",
        red: "#FF6A89",
        darkRed: "#DE3659",
        violet: "#8F7EE5",
        darkViolet: "#6959B8",
        yellow: "#FFF5BE",
        darkYellow: "#FFBC3C",
        white: "#FFFFFF",
    },

    boxShadow: {
        sidebar: "4px 0 16px rgba(170, 180, 190, 0.4)",
        secondary: "0 0 16px rgba(192, 201, 211, 0.8)",
        indicator: "1px 0 3px rgba(47, 151, 255, 0.4)",
        paper: "0 0 16px rgba(222, 229, 239, 0.4) !important",
        default: "none",
    },
};

ReactDOM.render(
    <JssProvider>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </JssProvider>,
    document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
ServiceWorker.unregister();
