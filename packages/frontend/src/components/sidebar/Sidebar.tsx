/** @jsx jsx */

import { jsx } from "@emotion/core";
import { ExecutorIcon, ObjectIcon, ReportsIcon, TasksIcon, TemplatesIcon } from "@magnit/icons";
import { Drawer, Grid, List, ListItem, ListItemIcon, Typography } from "@material-ui/core";
import { Link, RouteComponentProps } from "@reach/router";
import _ from "lodash";
import * as React from "react";
import { MagnitIcon } from "./MagnitIcon";

export const Sidebar: React.FC<RouteComponentProps> = ({ location }) => {
    return (
        <Drawer
            variant="permanent"
            open={true}
            id="drawer"
            css={({ spacing, colors }) => ({
                ".paper": {
                    border: "none",
                    boxShadow: `${spacing(0.5)} 0 ${spacing(2)} ${colors.gray}40`,
                },
            })}
            classes={{ paper: "paper" }}
        >
            <div
                css={theme => ({
                    boxShadow: "none",
                    width: theme.spacing(11),
                })}
            >
                <Grid
                    container
                    justify="center"
                    alignItems="center"
                    id="logo"
                    css={theme => ({
                        width: theme.spacing(11),
                        height: theme.spacing(12),
                    })}
                >
                    <Grid item css={({ spacing }) => ({ padding: `${spacing(2)} ${spacing()}` })}>
                        <Link to="/">
                            <MagnitIcon />
                        </Link>
                    </Grid>
                </Grid>
                <List>
                    {[
                        { text: "Задания", icon: TasksIcon, to: "/tasks" },
                        { text: "Шаблоны", icon: TemplatesIcon, to: "/templates" },
                        { text: "Объекты", icon: ObjectIcon, to: "/object" },
                        { text: "Исполнители", icon: ExecutorIcon, to: "/executor" },
                        { text: "Отчёты", icon: ReportsIcon, to: "/reports" },
                    ].map(({ text, icon: Icon, to }) => {
                        const active = _.get(location, "pathname", "").indexOf(to) !== -1;
                        return (
                            <ListItem
                                component={Link}
                                to={to}
                                key={text}
                                css={({ spacing, colors }) => ({
                                    position: "relative",
                                    padding: `${spacing(3)} 0`,
                                    display: "block",
                                    ":visited": { color: colors.blue },
                                    ":hover, :active": { color: colors.black },
                                })}
                            >
                                <Grid
                                    container
                                    direction="column"
                                    justify="center"
                                    alignItems="center"
                                    css={({ colors }) => ({
                                        position: "relative",
                                        ":hover": {
                                            "div:first-of-type": { background: colors.primary },
                                        },
                                    })}
                                >
                                    <Grid
                                        item
                                        css={({ spacing, radius, colors }) => ({
                                            display: "block",
                                            position: "absolute",
                                            transition: "0.25s",
                                            top: spacing(-0.5),
                                            left: 0,
                                            width: spacing(0.5),
                                            height: spacing(8),
                                            borderTopRightRadius: radius(0.5),
                                            borderBottomRightRadius: radius(0.5),
                                            background: active ? colors.primary : "none",
                                            boxShadow: active
                                                ? `1px 0 ${colors.shadowBlue}40`
                                                : "none",
                                        })}
                                    />
                                    <Grid item css={{ div: { background: "none !important" } }}>
                                        <ListItemIcon>
                                            <Grid container justify="center" alignItems="center">
                                                <Grid item>
                                                    <Icon
                                                        css={({ colors }) => ({
                                                            color: active
                                                                ? colors.primary
                                                                : colors.gray,
                                                        })}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </ListItemIcon>
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            css={({ colors, fontSize }) => ({
                                                color: active ? colors.primary : colors.gray,
                                                fontSize: fontSize.small,
                                                fontWeight: 500,
                                            })}
                                        >
                                            {text}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        );
                    })}
                </List>
            </div>
        </Drawer>
    );
};

Sidebar.displayName = "Sidebar";
