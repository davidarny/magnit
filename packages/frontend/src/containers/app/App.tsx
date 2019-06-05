/** @jsx jsx */

import { jsx, css, Global } from "@emotion/core";
import React, { useEffect, useState } from "react";
import { Sidebar } from "components/sidebar";
import { Grid } from "@material-ui/core";
import { RouteComponentProps, Router } from "@reach/router";
import Loadable, { OptionsWithoutRender } from "react-loadable";
import { Loading } from "components/loading";
import * as R from "ramda";

const AsyncTasks = Loadable(({
    loader: () => import("containers/tasks").then(module => module.Tasks),
    loading: Loading,
} as unknown) as OptionsWithoutRender<RouteComponentProps>);

const App: React.FC = () => {
    const [drawerWidth, setDrawerWidth] = useState(0);

    useEffect(() => {
        const isNotNil = R.compose(
            R.not,
            R.isNil
        );

        const getChildren = R.prop("children") as () => HTMLCollection;
        const getClientWidth = R.prop("clientWidth") as () => number;

        const getFirstChild = R.compose<HTMLCollection, HTMLElement[], HTMLElement>(
            array => R.head(array)!,
            Array.from,
            getChildren
        );

        const setWidthWhenNotNil = R.when<HTMLElement, void>(
            isNotNil,
            R.pipe(
                getFirstChild,
                getClientWidth,
                setDrawerWidth
            )
        );

        setWidthWhenNotNil(document.getElementById("drawer")!);
    }, []);

    return (
        <>
            <GlobalStyles />
            <Grid container>
                <Grid item>
                    <Sidebar />
                </Grid>
                <Grid
                    item
                    css={css`
                        margin-left: ${drawerWidth}px;
                        width: 100%;
                    `}
                >
                    <Router>
                        <AsyncTasks path="tasks/*" />
                    </Router>
                </Grid>
            </Grid>
        </>
    );
};

const GlobalStyles: React.FC = () => {
    return (
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
    );
};

export default App;
