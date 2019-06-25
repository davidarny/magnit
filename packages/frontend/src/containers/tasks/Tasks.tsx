/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Grid, AppBar, Tabs, Tab } from "@material-ui/core";
import * as React from "react";
import { Link, RouteComponentProps } from "@reach/router";
import { useState } from "react";
import { RouteMatcher } from "components/route-matcher";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";

enum ETabIndex {
    ALL = 0,
    NEW,
    SENT,
    IN_PROGRESS,
    DONE,
    REJECTED,
    OVERDUE,
    DEACTIVATED,
}

enum ETabPath {
    ALL = "all",
    NEW = "new",
    SENT = "sent",
    IN_PROGRESS = "in-progress",
    DONE = "done",
    REJECTED = "rejected",
    OVERDUE = "overdue",
    DEACTIVATED = "deactivated",
}

export const Tasks: React.FC<RouteComponentProps> = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const tabTitleByPath = {
        [ETabPath.ALL]: "Все",
        [ETabPath.NEW]: "Новые",
        [ETabPath.SENT]: "Отправленные",
        [ETabPath.IN_PROGRESS]: "В работе",
        [ETabPath.DONE]: "Выполненные",
        [ETabPath.REJECTED]: "Отозванные",
        [ETabPath.OVERDUE]: "Просроченные",
        [ETabPath.DEACTIVATED]: "Деактивированные",
    };

    return (
        <SectionLayout>
            <RouteMatcher
                routes={[
                    {
                        paths: ["", ETabPath.ALL],
                        render: () => setTabIndex(ETabIndex.ALL),
                    },
                    {
                        path: ETabPath.NEW,
                        render: () => setTabIndex(ETabIndex.NEW),
                    },
                    {
                        path: ETabPath.SENT,
                        render: () => setTabIndex(ETabIndex.SENT),
                    },
                    {
                        path: ETabPath.IN_PROGRESS,
                        render: () => setTabIndex(ETabIndex.IN_PROGRESS),
                    },
                    {
                        path: ETabPath.DONE,
                        render: () => setTabIndex(ETabIndex.DONE),
                    },
                    {
                        path: ETabPath.REJECTED,
                        render: () => setTabIndex(ETabIndex.REJECTED),
                    },
                    {
                        path: ETabPath.OVERDUE,
                        render: () => setTabIndex(ETabIndex.OVERDUE),
                    },
                    {
                        path: ETabPath.DEACTIVATED,
                        render: () => setTabIndex(ETabIndex.DEACTIVATED),
                    },
                ]}
            />
            <SectionTitle title="Список заданий" />
            <Grid item>
                <AppBar position="static">
                    <Tabs value={tabIndex} css={theme => ({ paddingLeft: theme.spacing(4) })}>
                        <Tab
                            to={ETabPath.ALL}
                            component={Link}
                            label={tabTitleByPath[ETabPath.ALL]}
                        />
                        <Tab
                            to={ETabPath.NEW}
                            component={Link}
                            label={tabTitleByPath[ETabPath.NEW]}
                        />
                        <Tab
                            to={ETabPath.SENT}
                            component={Link}
                            label={tabTitleByPath[ETabPath.SENT]}
                        />
                        <Tab
                            to={ETabPath.IN_PROGRESS}
                            component={Link}
                            label={tabTitleByPath[ETabPath.IN_PROGRESS]}
                        />
                        <Tab
                            to={ETabPath.DONE}
                            component={Link}
                            label={tabTitleByPath[ETabPath.DONE]}
                        />
                        <Tab
                            to={ETabPath.REJECTED}
                            component={Link}
                            label={tabTitleByPath[ETabPath.REJECTED]}
                        />
                        <Tab
                            to={ETabPath.OVERDUE}
                            component={Link}
                            label={tabTitleByPath[ETabPath.OVERDUE]}
                        />
                        <Tab
                            to={ETabPath.DEACTIVATED}
                            component={Link}
                            label={tabTitleByPath[ETabPath.DEACTIVATED]}
                        />
                    </Tabs>
                </AppBar>
            </Grid>
        </SectionLayout>
    );
};
