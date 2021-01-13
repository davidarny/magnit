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
    loader: () => import("containers/splash"),
    loading: Loading,
});

// tasks
const AsyncTasksList = Loadable({
    loader: async () => import("containers/tasks/TasksList"),
    loading: Loading,
});
const AsyncViewTask = Loadable({
    loader: async () => import("containers/tasks/ViewTask"),
    loading: Loading,
});
const AsyncCreateTask = Loadable({
    loader: async () => import("containers/tasks/CreateTask"),
    loading: Loading,
});
const AsyncTaskHistory = Loadable({
    loader: async () => import("containers/tasks/TaskHistory"),
    loading: Loading,
});
const AsyncTaskReport = Loadable({
    loader: async () => import("containers/tasks/TaskReport"),
    loading: Loading,
});

// templates
const AsyncTemplates = Loadable({
    loader: async () => import("containers/templates/TemplateList"),
    loading: Loading,
});
const AsyncCreateTemplate = Loadable({
    loader: async () => import("containers/templates/CreateTemplate"),
    loading: Loading,
});
const AsyncEditTemplate = Loadable({
    loader: async () => import("containers/templates/EditTemplate"),
    loading: Loading,
});

// users
const AsyncUserList = Loadable({
    loader: async () => import("containers/users"),
    loading: Loading,
});

// marketplaces
const AsyncMarketplaceList = Loadable({
    loader: async () => import("containers/marketplaces"),
    loading: Loading,
});

export const App: React.FC = () => {
    const context = useContext(AppContext);

    const [token, setToken] = useState(""); // auth token

    const authorized = !!token;

    const courier = useFetchCourier(token);
    const users = useUsers(courier, authorized);
    const [username, handleLogin, handleLogout, handleTokenExpiration] = useCredentials(
        courier,
        token,
        setToken,
    );
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
                            render={props => <AsyncViewTask {...props} users={users} />}
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

                        {/* users */}
                        <PrivateRoute
                            authorized={authorized}
                            path="users"
                            render={props => <AsyncUserList {...props} />}
                        />

                        {/* marketplaces */}
                        <PrivateRoute
                            authorized={authorized}
                            path="marketplaces"
                            render={props => <AsyncMarketplaceList {...props} />}
                        />

                        {/* not found */}
                        <NotFound default to="tasks" onLogout={handleLogout} />
                    </Router>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

App.displayName = "App";
