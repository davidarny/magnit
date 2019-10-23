/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Grid } from "@material-ui/core";
import { navigate, Router } from "@reach/router";
import { GlobalStyles } from "components/global-styles";
import { Loading } from "components/loading";
import { NotFound } from "components/not-found";
import { PrivateRoute } from "components/private-route";
import { Sidebar } from "components/sidebar";
import { Snackbar } from "components/snackbar";
import { ITaskHistoryProps, ITaskReportProps, IViewTaskProps } from "containers/tasks";
import { IEditTemplateProps } from "containers/templates";
import { AppContext } from "context";
import _ from "lodash";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Loadable from "react-loadable";
import { CamelCaseMiddleware, FetchCourier, LoggerMiddleware, login } from "services/api";
import { JsonParseMiddleware } from "services/api/middlewares";
import { IAuthObserver } from "../../services/api/entities/IAuthObserver";

const AsyncSplash = Loadable({
    loader: async () => import("containers/splash").then(module => module.Splash),
    loading: Loading,
});
const AsyncTasksList = Loadable({
    loader: async () => import("containers/tasks").then(module => module.TasksList),
    loading: Loading,
});
const AsyncViewTask = Loadable({
    loader: async () => import("containers/tasks").then(module => module.ViewTask),
    loading: Loading,
});
const AsyncCreateTask = Loadable({
    loader: async () => import("containers/tasks").then(module => module.CreateTask),
    loading: Loading,
});
const AsyncTaskHistory = Loadable({
    loader: async () => import("containers/tasks").then(module => module.TaskHistory),
    loading: Loading,
});
const AsyncTaskReport = Loadable({
    loader: async () => import("containers/tasks").then(module => module.TaskReport),
    loading: Loading,
});
const AsyncTemplates = Loadable({
    loader: async () => import("containers/templates").then(module => module.TemplateList),
    loading: Loading,
});
const AsyncCreateTemplate = Loadable({
    loader: async () => import("containers/templates").then(module => module.CreateTemplate),
    loading: Loading,
});
const AsyncEditTemplate = Loadable({
    loader: async () => import("containers/templates").then(module => module.EditTemplate),
    loading: Loading,
});

export const App: React.FC = () => {
    const context = useContext(AppContext);

    const [error, setError] = useState(false); // success/error snackbar state
    const [snackbar, setSnackbar] = useState({ open: false, message: "" }); // open/close snackbar

    const [drawerWidth, setDrawerWidth] = useState(0);
    const [logoHeight, setLogoHeight] = useState(0);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [token, setToken] = useState(""); // auth token

    const courier = useMemo(
        () =>
            new FetchCourier(process.env.REACT_APP_BACKEND_URL, "v1", token, [
                new JsonParseMiddleware(),
                new CamelCaseMiddleware(),
                new LoggerMiddleware(),
            ]),
        [token],
    );

    const handleLogin = useCallback(
        (username: string, password: string) => {
            setUsername(username);
            setPassword(password);
            login(courier, username, password)
                .then(response => setToken(response.token))
                .then(() => navigate("tasks"))
                .catch(() => {
                    setSnackbar({ open: true, message: "Не удалось авторизоваться" });
                    setError(true);
                });
        },
        [courier],
    );

    const handleTokenExpiration = useCallback(
        (observer: IAuthObserver) => {
            login(courier, username, password)
                .then(response => observer.setToken(response.token))
                .catch(console.error);
        },
        [courier, password, username],
    );

    useEffect(() => {
        courier.doOnTokenExpired(handleTokenExpiration);
    }, [courier, handleTokenExpiration]);

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
    }, [token]);

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

    const authorized = !!token;

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
                        <PrivateRoute
                            authorized={authorized}
                            noRedirect
                            path="*"
                            render={props => <Sidebar {...props} />}
                        />
                    </Router>
                </Grid>
                <Grid
                    css={{
                        marginLeft: "var(--section-left-margin)",
                        width: "100%",
                    }}
                >
                    <Router primary>
                        <AsyncSplash path="login" onLogin={handleLogin} />
                        <PrivateRoute
                            authorized={authorized}
                            path="tasks/*"
                            render={props => <AsyncTasksList {...props} />}
                        />
                        {process.env.REACT_APP_ALLOW_CREATE_TASK && (
                            <PrivateRoute
                                authorized={authorized}
                                path="tasks/create"
                                render={props => <AsyncCreateTask {...props} />}
                            />
                        )}
                        <PrivateRoute<IViewTaskProps>
                            authorized={authorized}
                            path="tasks/view/:taskId"
                            render={props => <AsyncViewTask {...props} />}
                        />
                        <PrivateRoute<ITaskHistoryProps>
                            authorized={authorized}
                            path="tasks/:taskId/history"
                            render={props => <AsyncTaskHistory {...props} />}
                        />
                        <PrivateRoute<ITaskReportProps>
                            authorized={authorized}
                            path="tasks/:taskId/report"
                            render={props => <AsyncTaskReport {...props} />}
                        />
                        <PrivateRoute
                            authorized={authorized}
                            path="templates"
                            render={props => <AsyncTemplates {...props} />}
                        />
                        <PrivateRoute
                            authorized={authorized}
                            path="templates/create"
                            render={props => <AsyncCreateTemplate {...props} />}
                        />
                        <PrivateRoute<IEditTemplateProps>
                            authorized={authorized}
                            path="templates/edit/:templateId"
                            render={props => <AsyncEditTemplate {...props} />}
                        />
                        <NotFound default to="tasks" />
                    </Router>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

App.displayName = "App";
