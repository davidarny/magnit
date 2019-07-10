/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { Drawer, Grid, List, ListItem, ListItemIcon, Typography } from "@material-ui/core";
import { Link, RouteComponentProps } from "@reach/router";
import { ReportsIcon, TasksIcon, TemplatesIcon, ExecutorIcon, ObjectIcon } from "@magnit/icons";
import MagnitIcon from "assets/MagnitIcon.png";
import _ from "lodash";

export const Sidebar: React.FC<RouteComponentProps> = ({ location = {} }) => {
    return (
        <Drawer
            variant="permanent"
            open={true}
            id="drawer"
            css={theme => ({
                ".paper": {
                    border: "none",
                    boxShadow: `${theme.spacing(0.5)} 0 ${theme.spacing(2)} ${theme.colors.gray}40`,
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
                    <Grid
                        item
                        css={theme => ({ padding: `${theme.spacing(2)} ${theme.spacing()}` })}
                    >
                        <Link to="/">
                            <img
                                src={MagnitIcon}
                                css={css`
                                    max-width: 60px;
                                `}
                                alt="Магнит"
                            />
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
                        const isActive = _.get(location, "pathname", "").indexOf(to) !== -1;
                        return (
                            <ListItem
                                component={Link}
                                to={to}
                                key={text}
                                css={theme => ({
                                    position: "relative",
                                    padding: `${theme.spacing(3)} 0`,
                                    display: "block",
                                    ":visited": { color: theme.colors.blue },
                                    ":hover, :active": { color: theme.colors.black },
                                })}
                            >
                                <Grid
                                    container
                                    direction="column"
                                    justify="center"
                                    alignItems="center"
                                    css={theme => ({
                                        position: "relative",
                                        ":hover": {
                                            "div:first-of-type": {
                                                background: theme.colors.primary,
                                            },
                                        },
                                    })}
                                >
                                    <Grid
                                        item
                                        css={theme => ({
                                            display: "block",
                                            position: "absolute",
                                            transition: "0.25s",
                                            top: theme.spacing(-0.5),
                                            left: 0,
                                            width: theme.spacing(0.5),
                                            height: theme.spacing(8),
                                            borderTopRightRadius: theme.radius(0.5),
                                            borderBottomRightRadius: theme.radius(0.5),
                                            background: isActive ? theme.colors.primary : "none",
                                            boxShadow: isActive
                                                ? `1px 0 ${theme.colors.shadowBlue}40`
                                                : "none",
                                        })}
                                    />
                                    <Grid
                                        item
                                        css={css`
                                            div {
                                                background: none !important;
                                            }
                                        `}
                                    >
                                        <ListItemIcon>
                                            <Grid container justify="center" alignItems="center">
                                                <Grid item>
                                                    <Icon isActive={isActive} />
                                                </Grid>
                                            </Grid>
                                        </ListItemIcon>
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            css={theme => ({
                                                color: isActive
                                                    ? theme.colors.primary
                                                    : theme.colors.gray,
                                                fontSize: theme.fontSize.small,
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
