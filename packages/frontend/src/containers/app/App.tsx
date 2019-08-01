/** @jsx jsx */

import { css, Global, jsx } from "@emotion/core";
import React, { useEffect, useRef, useState } from "react";
import { Sidebar } from "components/sidebar";
import { Grid } from "@material-ui/core";
import { RouteComponentProps, Router } from "@reach/router";
import Loadable, { OptionsWithoutRender } from "react-loadable";
import { Loading } from "components/loading";
import _ from "lodash";
import { CamelCaseMiddleware, FetchCourier, LoggerMiddleware } from "services/api";
import { AppContext } from "context";
import { JsonParseMiddleware } from "../../services/api/middlewares/JsonParseMiddleware";

// ████████╗ █████╗ ███████╗██╗  ██╗███████╗
// ╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝██╔════╝
//    ██║   ███████║███████╗█████╔╝ ███████╗
//    ██║   ██╔══██║╚════██║██╔═██╗ ╚════██║
//    ██║   ██║  ██║███████║██║  ██╗███████║
//    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝
const AsyncTasksList = Loadable(({
    loader: () => import("containers/tasks").then(module => module.TasksList),
    loading: Loading,
} as unknown) as OptionsWithoutRender<RouteComponentProps>);
const AsyncViewTask = Loadable(({
    loader: () => import("containers/tasks").then(module => module.ViewTask),
    loading: Loading,
} as unknown) as OptionsWithoutRender<RouteComponentProps>);
const AsyncCreateTask = Loadable(({
    loader: () => import("containers/tasks").then(module => module.CreateTask),
    loading: Loading,
} as unknown) as OptionsWithoutRender<RouteComponentProps>);

// ████████╗███████╗███╗   ███╗██████╗ ██╗      █████╗ ████████╗███████╗███████╗
// ╚══██╔══╝██╔════╝████╗ ████║██╔══██╗██║     ██╔══██╗╚══██╔══╝██╔════╝██╔════╝
//    ██║   █████╗  ██╔████╔██║██████╔╝██║     ███████║   ██║   █████╗  ███████╗
//    ██║   ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██╔══██║   ██║   ██╔══╝  ╚════██║
//    ██║   ███████╗██║ ╚═╝ ██║██║     ███████╗██║  ██║   ██║   ███████╗███████║
//    ╚═╝   ╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚══════╝
const AsyncTemplates = Loadable(({
    loader: () => import("containers/templates").then(module => module.TemplateList),
    loading: Loading,
} as unknown) as OptionsWithoutRender<RouteComponentProps>);
const AsyncCreateTemplate = Loadable(({
    loader: () => import("containers/templates").then(module => module.CreateTemplate),
    loading: Loading,
} as unknown) as OptionsWithoutRender<RouteComponentProps>);
const AsyncEditTemplate = Loadable(({
    loader: () => import("containers/templates").then(module => module.EditTemplate),
    loading: Loading,
} as unknown) as OptionsWithoutRender<RouteComponentProps>);

const App: React.FC = () => {
    const [drawerWidth, setDrawerWidth] = useState(0);
    const [logoHeight, setLogoHeight] = useState(0);
    const courier = useRef(
        new FetchCourier(process.env.REACT_APP_BACKEND_URL, "v1", [
            new JsonParseMiddleware(),
            new CamelCaseMiddleware(),
            new LoggerMiddleware(),
        ]),
    );

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
                    <AppContext.Provider value={{ courier: courier.current }}>
                        <Router>
                            {/*
                            ████████╗ █████╗ ███████╗██╗  ██╗███████╗
                            ╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝██╔════╝
                               ██║   ███████║███████╗█████╔╝ ███████╗
                               ██║   ██╔══██║╚════██║██╔═██╗ ╚════██║
                               ██║   ██║  ██║███████║██║  ██╗███████║
                               ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝
                            */}
                            <AsyncTasksList path="tasks/*" />
                            <AsyncCreateTask path="tasks/create" />
                            <AsyncViewTask path="tasks/view/:taskId" />
                            {/*
                            ████████╗███████╗███╗   ███╗██████╗ ██╗      █████╗ ████████╗███████╗███████╗
                            ╚══██╔══╝██╔════╝████╗ ████║██╔══██╗██║     ██╔══██╗╚══██╔══╝██╔════╝██╔════╝
                               ██║   █████╗  ██╔████╔██║██████╔╝██║     ███████║   ██║   █████╗  ███████╗
                               ██║   ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██╔══██║   ██║   ██╔══╝  ╚════██║
                               ██║   ███████╗██║ ╚═╝ ██║██║     ███████╗██║  ██║   ██║   ███████╗███████║
                               ╚═╝   ╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚══════╝
                            */}
                            <AsyncTemplates path="templates" />
                            <AsyncCreateTemplate path="templates/create" />
                            <AsyncEditTemplate path="templates/edit/:templateId" />
                        </Router>
                    </AppContext.Provider>
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
            styles={theme => ({
                ":root": {
                    "--section-title-height": `${props.section.titleHeight}px`,
                    "--section-left-margin": `${props.section.leftMargin}px`,
                },
                body: {
                    fontFamily: '"Roboto", sans-serif',
                    background: theme.colors.light,
                },
                "html, body": {
                    margin: 0,
                    height: "100%",
                    width: "100%",
                },
            })}
        />
    );
};

export default App;
