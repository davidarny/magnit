/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Grid } from "@material-ui/core";
import { Router } from "@reach/router";
import { GlobalStyles } from "components/global-styles";
import { Loading } from "components/loading";
import { NotFound } from "components/not-found";
import { PrivateRoute } from "components/private-route";
import { Sidebar } from "components/sidebar";
import { Snackbar } from "components/snackbar";
import { ITaskHistoryProps, ITaskReportProps, IViewTaskProps } from "containers/tasks";
import { IEditTemplateProps } from "containers/templates";
import { AppContext } from "context";
import { useCredentials, useFetchCourier, usePageOffset, useSnackbar, useUsers } from "hooks";
import React, { useContext, useEffect, useState } from "react";
import Loadable from "react-loadable";

// splash
const AsyncSplash = Loadable({
    loader: async () => import("containers/splash").then(module => module.Splash),
    loading: Loading,
});

// tasks
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

// templates
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

    const [token, setToken] = useState(""); // auth token

    const authorized = !!token;

    const courier = useFetchCourier(token);
    const users = useUsers(courier, authorized);
    const [username, handleLogin, handleTokenExpiration] = useCredentials(courier, token, setToken);
    const [drawerWidth, logoHeight] = usePageOffset(authorized);
    const [error, snackbar, setSnackbarError, setSnackbarState, onSnackbarClose] = useSnackbar();

    useEffect(() => {
        courier.doOnTokenExpired(handleTokenExpiration);
    }, [courier, handleTokenExpiration]);

    context.courier = courier;
    context.setSnackbarError = setSnackbarError;
    context.setSnackbarState = setSnackbarState;
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
                        {/* splash */}
                        <AsyncSplash path="login" onLogin={handleLogin} />

                        {/* tasks */}
                        <PrivateRoute
                            authorized={authorized}
                            path="tasks/*"
                            render={props => <AsyncTasksList {...props} />}
                        />
                        {process.env.REACT_APP_ALLOW_CREATE_TASK && (
                            <PrivateRoute
                                authorized={authorized}
                                path="tasks/create"
                                render={props => (
                                    <AsyncCreateTask username={username} users={users} {...props} />
                                )}
                            />
                        )}
                        <PrivateRoute<IViewTaskProps>
                            authorized={authorized}
                            path="tasks/view/:taskId"
                            render={props => <AsyncViewTask users={users} {...props} />}
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

                        {/* templates */}
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
