/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { Drawer, Grid, List, ListItem, ListItemIcon, Typography } from "@material-ui/core";
import { Link, RouteComponentProps } from "@reach/router";
import {
    AddIcon,
    ReportsIcon,
    TasksIcon,
    TemplatesIcon,
    ExecutorIcon,
    ObjectIcon,
} from "@magnit/icons";
import { CustomButton } from "@magnit/components";
import _ from "lodash";

export const Sidebar: React.FC<RouteComponentProps> = ({ location = {} }) => {
    return (
        <Drawer
            variant="permanent"
            open={true}
            id="drawer"
            css={{
                "> div": {
                    border: "none",
                    boxShadow: "4px 0 15px rgba(207, 217, 227, 0.4)",
                },
            }}
        >
            <div
                style={{
                    boxShadow: "none",
                    width: 88,
                }}
            >
                <Grid
                    container
                    justify="center"
                    alignItems="center"
                    id="logo"
                    css={{ width: 88, height: 96 }}
                >
                    <Grid
                        item
                        css={theme => ({ padding: `${theme.spacing(2)} ${theme.spacing()}` })}
                    >
                        <Link to="/">
                            <CustomButton
                                icon={<AddIcon />}
                                variants={"blue"}
                                iconOnly={true}
                                iconSize={40}
                                css={{
                                    width: 40,
                                }}
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
                                    css={css`
                                        position: relative;
                                        :hover {
                                            div:first-of-type {
                                                background-color: #2F97FF
                                            }
                                        }
                                    `}
                                >
                                    <Grid
                                        item
                                        css={theme => ({
                                            display: "block",
                                            position: "absolute",
                                            transition: "0.25s",
                                            top: -3,
                                            left: 0,
                                            width: 3,
                                            height: 64,
                                            borderTopRightRadius: 3,
                                            borderBottomRightRadius: 3,
                                            background: isActive ? theme.colors.blue : "none",
                                            boxShadow: isActive
                                                ? "1px 0 rgba(47, 151, 255, 0.4)"
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
                                                    ? theme.colors.blue
                                                    : theme.colors.darkGray,
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
