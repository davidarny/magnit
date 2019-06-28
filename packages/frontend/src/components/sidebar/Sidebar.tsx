/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { Divider, Drawer, Grid, List, ListItem, ListItemIcon, Typography } from "@material-ui/core";
import LogoIcon from "assets/magnit.png";
import { Link } from "@reach/router";
import { ReportsIcon, TasksIcon, TemplatesIcon } from "icons";

export const Sidebar: React.FC = () => {
    return (
        <Drawer variant="permanent" open={true} id="drawer">
            <Grid container justify="center" alignItems="center" id="logo">
                <Grid item css={theme => ({ padding: `${theme.spacing(2)} ${theme.spacing()}` })}>
                    <Link to="/">
                        <img
                            src={LogoIcon}
                            css={{
                                maxWidth: 60,
                            }}
                            alt="Магнит"
                        />
                    </Link>
                </Grid>
            </Grid>
            <Divider />
            <List>
                {[
                    { text: "Задания", icon: TasksIcon, to: "/tasks" },
                    { text: "Шаблоны", icon: TemplatesIcon, to: "/templates" },
                    { text: "Отчёты", icon: ReportsIcon, to: "/reports" },
                ].map(({ text, icon: Icon, to }) => (
                    <ListItem
                        component={Link}
                        to={to}
                        key={text}
                        css={theme => ({
                            padding: `${theme.spacing(3)} 0`,
                            ":visited": { color: theme.colors.secondary },
                            ":hover, :active": { color: theme.colors.primary },
                        })}
                    >
                        <Grid container direction="column" justify="center" alignItems="center">
                            <Grid item>
                                <ListItemIcon>
                                    <Grid container justify="center" alignItems="center">
                                        <Grid item>
                                            <Icon />
                                        </Grid>
                                    </Grid>
                                </ListItemIcon>
                            </Grid>
                            <Grid item>
                                <Typography
                                    css={theme => ({
                                        fontSize: theme.fontSize.small,
                                        fontWeight: 500,
                                    })}
                                >
                                    {text}
                                </Typography>
                            </Grid>
                        </Grid>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};
