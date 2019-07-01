/** @jsx jsx */

import { jsx, css, Global } from "@emotion/core";
import React, { useEffect, useState } from "react";
import { Sidebar } from "components/sidebar";
import { Grid } from "@material-ui/core";
import { RouteComponentProps, Router } from "@reach/router";
import Loadable, { OptionsWithoutRender } from "react-loadable";
import { Loading } from "components/loading";
import _ from "lodash";

const AsyncTasks = Loadable(({
    loader: () => import("containers/tasks").then(module => module.Tasks),
    loading: Loading,
} as unknown) as OptionsWithoutRender<RouteComponentProps>);
const AsyncTemplates = Loadable(({
    loader: () => import("containers/templates").then(module => module.Templates),
    loading: Loading,
} as unknown) as OptionsWithoutRender<RouteComponentProps>);
const AsyncCreateTemplate = Loadable(({
    loader: () => import("containers/create-template").then(module => module.CreateTemplate),
    loading: Loading,
} as unknown) as OptionsWithoutRender<RouteComponentProps>);

const App: React.FC = () => {
    const [drawerWidth, setDrawerWidth] = useState(0);
    const [logoHeight, setLogoHeight] = useState(0);

    useEffect(() => {
        const drawer = document.getElementById("drawer");
        if (!drawer) {
            return;
        }
        const drawerFirstChild = _.head(Array.from(drawer.children));
        if (!drawerFirstChild) {
            return;
        }
        setDrawerWidth(drawerFirstChild.clientWidth);

        const logo = document.getElementById("logo");
        if (!logo) {
            return;
        }
        setLogoHeight(logo.clientHeight);
    }, []);

    return (
        <React.Fragment>
            <GlobalStyles
                section={{
                    titleHeight: logoHeight,
                    leftMargin: drawerWidth,
                }}
            />
            <Grid container>
                <Grid item>
                    <Router primary={false}>
                        <Sidebar path="*" />
                    </Router>
                </Grid>
                <Grid
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
        </React.Fragment>
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
                    background: #f6f7fb;
                }
            `}
        />
    );
};

export default App;
