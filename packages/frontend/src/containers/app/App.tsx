/** @jsx jsx */

import { jsx, css, Global } from "@emotion/core";
import { Header } from "components/header";
import React from "react";

const App: React.FC = () => {
    return (
        <>
            <Global
                styles={css`
                    body {
                        font-family: "Roboto", sans-serif;
                    }
                    html,
                    body {
                        margin: 0;
                        height: 100%;
                        width: 100%;
                    }
                    body {
                        background: #eeeeee;
                    }
                `}
            />
            <Header />
        </>
    );
};

export default App;
