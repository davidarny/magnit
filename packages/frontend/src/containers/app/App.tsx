/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Grid } from "@material-ui/core";
import { RouteComponentProps, Router } from "@reach/router";
import { GlobalStyles } from "components/global-styles";
import { Loading } from "components/loading";
import { PrivateRoute } from "components/private-route";
import { Sidebar } from "components/sidebar";
import { Snackbar } from "components/snackbar";
import { AppContext } from "context";
import _ from "lodash";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Loadable, { OptionsWithoutRender } from "react-loadable";
import { CamelCaseMiddleware, FetchCourier, LoggerMiddleware } from "services/api";
import { JsonParseMiddleware } from "services/api/middlewares";
import { NotFound } from "../../components/not-found";

const AsyncSplash = Loadable(({
    loader: () => import("containers/splash").then(module => module.Splash),
    loading: Loading,
} as unknown) as OptionsWithoutRender<RouteComponentProps>);
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
const AsyncTaskHistory = Loadable(({
    loader: () => import("containers/tasks").then(module => module.TaskHistory),
    loading: Loading,
} as unknown) as OptionsWithoutRender<RouteComponentProps>);
const AsyncTaskReport = Loadable(({
    loader: () => import("containers/tasks").then(module => module.TaskReport),
    loading: Loading,
} as unknown) as OptionsWithoutRender<RouteComponentProps>);
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

export const App: React.FC = () => {
    const context = useContext(AppContext);
    const [error, setError] = useState(false); // success/error snackbar state
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
    }); // open/close snackbar

    const [drawerWidth, setDrawerWidth] = useState(0);
    const [logoHeight, setLogoHeight] = useState(0);

    const courier = useMemo(
        () =>
            new FetchCourier(process.env.REACT_APP_BACKEND_URL, "v1", [
                new JsonParseMiddleware(),
                new CamelCaseMiddleware(),
                new LoggerMiddleware(),
            ]),
        [],
    );

    useEffect(() => {
        const drawer = document.getElementById("drawer");
        if (!drawer) {
            return;
        }
        const drawerFirstChild = _.head([...drawer.children]);
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

    function onSnackbarClose(event?: React.SyntheticEvent, reason?: string) {
        if (reason === "clickaway") {
            return;
        }
        setSnackbar({ open: false, message: "" });
        // wait till animation ends
        setTimeout(() => setError(false), 100);
    }

    context.courier = courier;
    context.setSnackbarError = setError;
    context.setSnackbarState = setSnackbar;
    context.snackbar = snackbar;

    return (
        <React.Fragment>
            <Snackbar
                open={snackbar.open}
                error={error}
                onClose={onSnackbarClose}
                message={snackbar.message}
            />
            <GlobalStyles
                section={{
                    titleHeight: logoHeight,
                    leftMargin: drawerWidth,
                }}
            />
            <Grid container>
                <Grid item>
                    <Router primary={false}>
                        <PrivateRoute noRedirect path="*">
                            {props => <Sidebar {...props} />}
                        </PrivateRoute>
                    </Router>
                </Grid>
                <Grid
                    css={{
                        marginLeft: "var(--section-left-margin)",
                        width: "100%",
                    }}
                >
                    <Router primary>
                        <AsyncSplash path="login" />
                        <PrivateRoute path="tasks/*">
                            {props => <AsyncTasksList {...props} />}
                        </PrivateRoute>
                        {process.env.REACT_APP_ALLOW_CREATE_TASK && (
                            <PrivateRoute path="tasks/create">
                                {props => <AsyncCreateTask {...props} />}
                            </PrivateRoute>
                        )}
                        <PrivateRoute path="tasks/view/:taskId">
                            {props => <AsyncViewTask {...props} />}
                        </PrivateRoute>
                        <PrivateRoute path="tasks/:taskId/history">
                            {props => <AsyncTaskHistory {...props} />}
                        </PrivateRoute>
                        <PrivateRoute path="tasks/:taskId/report">
                            {props => <AsyncTaskReport {...props} />}
                        </PrivateRoute>
                        <PrivateRoute path="templates">
                            {props => <AsyncTemplates {...props} />}
                        </PrivateRoute>
                        <PrivateRoute path="templates/create">
                            {props => <AsyncCreateTemplate {...props} />}
                        </PrivateRoute>
                        <PrivateRoute path="templates/edit/:templateId">
                            {props => <AsyncEditTemplate {...props} />}
                        </PrivateRoute>
                        <NotFound default to="tasks" />
                    </Router>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

App.displayName = "App";
