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
const AsyncTemplates = Loadable(({
    loader: () => import("containers/templates").then(module => module.Templates),
    loading: Loading,
} as unknown) as OptionsWithoutRender<RouteComponentProps>);
const AsyncCreateTemplate = Loadable(({
    loader: () => import("containers/templates").then(module => module.CreateTemplate),
    loading: Loading,
} as unknown) as OptionsWithoutRender<RouteComponentProps>);

const App: React.FC = () => {
    const [drawerWidth, setDrawerWidth] = useState(0);
    const [logoHeight, setLogoHeight] = useState(0);

    useEffect(() => {
        const isNotNil = R.compose(
            R.not,
            R.isNil
        );

        const getChildren = R.prop("children") as () => HTMLCollection;
        const getClientWidth = R.prop("clientWidth") as () => number;
        const getClientHeight = R.prop("clientHeight") as () => number;

        const getFirstChild = R.compose<HTMLCollection, HTMLElement[], HTMLElement>(
            array => R.head(array)!,
            Array.from,
            getChildren
        );

        const setDrawerWidthWhenNotNil = R.when<HTMLElement, void>(
            isNotNil,
            R.pipe(
                getFirstChild,
                getClientWidth,
                setDrawerWidth
            )
        );
        const setLogoHeightWhenNotNil = R.when<HTMLElement, void>(
            isNotNil,
            R.pipe(
                getClientHeight,
                setLogoHeight
            )
        );

        setDrawerWidthWhenNotNil(document.getElementById("drawer")!);
        setLogoHeightWhenNotNil(document.getElementById("logo")!);
    }, []);

    return (
        <>
            <GlobalStyles
                section={{
                    titleHeight: logoHeight,
                    leftMargin: drawerWidth,
                }}
            />
            <Grid container>
                <Grid item>
                    <Sidebar />
                </Grid>
                <Grid
                    item
                    css={css`
                        margin-left: var(--section-left-margin);
                        width: 100%;
                    `}
                >
                    <Router>
                        <AsyncTasks path="tasks/*" />
                        <AsyncTemplates path="templates" />
                        <AsyncCreateTemplate path="templates/create" />
                    </Router>
                </Grid>
            </Grid>
        </>
    );
};

interface IGlobalStyleProps {
    section: {
        titleHeight: number;
        leftMargin: number;
    };
}

const GlobalStyles: React.FC<IGlobalStyleProps> = props => {
    return (
        <Global
            styles={css`
                :root {
                    --section-title-height: ${props.section.titleHeight}px;
                    --section-left-margin: ${props.section.leftMargin}px;
                }

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
