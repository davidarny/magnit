/** @jsx jsx */

import { jsx, css } from "@emotion/core";
import * as React from "react";
import { Divider, Drawer, List, ListItem, ListItemIcon, Grid, Typography } from "@material-ui/core";
import {
    Assignment as TasksIcon,
    Web as TemplateIcon,
    PieChart as ReportsIcon,
} from "@material-ui/icons";
import MagintIcon from "assets/magnit.png";
import { Link } from "@reach/router";

export const Sidebar: React.FC = () => {
    return (
        <Drawer variant="permanent" open={true} id="drawer">
            <Grid container justify="center" alignItems="center" id="logo">
                <Grid item css={theme => ({ padding: `${theme.spacing(2)} ${theme.spacing()}` })}>
                    <Link to="/">
                        <img
                            src={MagintIcon}
                            css={css`
                                max-width: 60px;
                            `}
                            alt="Магнит"
                        />
                    </Link>
                </Grid>
            </Grid>
            <Divider />
            <List>
                {[
                    { text: "Задания", icon: TasksIcon, to: "/tasks" },
                    { text: "Шаблоны", icon: TemplateIcon, to: "/templates" },
                    { text: "Отчёты", icon: ReportsIcon, to: "/reports" },
                ].map(({ text, icon: Icon, to }) => (
                    <ListItem
                        component={Link}
                        to={to}
                        key={text}
                        css={theme => ({ padding: `${theme.spacing(3)} 0` })}
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
                                <Typography css={theme => ({ fontSize: theme.fontSize.smaller })}>
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
