/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { Drawer, Grid, List, ListItem, ListItemIcon, Typography } from "@material-ui/core";
import { Link } from "@reach/router";
import { ReportsIcon, TasksIcon, TemplatesIcon } from "icons";
import { CustomButton, PlusIcon } from "@magnit/template-editor";

export const Sidebar: React.FC = () => {
    return (
        <Drawer variant="permanent" open={true} id="drawer"
                css={{
                    "> div": {
                        border: "none",
                        boxShadow: "4px 0 15px rgba(207, 217, 227, 0.4)",
                    },
                }}
        >
            <div
                css={{
                    boxShadow: "none",
                    width: 88,
                }}
            >
                <Grid container justify="center" alignItems="center" id="logo" css={{ width: 88, height: 96 }}>
                    <Grid item css={theme => ({ padding: `${theme.spacing(2)} ${theme.spacing()}` })}>
                        <Link to="/">
                            <CustomButton
                                icon={<PlusIcon/>}
                                buttonColor={"blue"}
                                onlyIcon={true}
                                sizeIcon={40}
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
                        { text: "Отчёты", icon: ReportsIcon, to: "/reports" },
                    ].map(({ text, icon: Icon, to }) => (
                        <ListItem
                            component={Link}
                            to={to}
                            key={text}
                            css={theme => ({
                                position: "relative",
                                padding: `${theme.spacing(3)} 0`,
                                ":visited": { color: theme.colors.blue },
                                ":hover, :active": { color: theme.colors.black },
                                ":before": {
                                    context: "",
                                    display: "block",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: 3,
                                    height: 64,
                                    borderTopRightRadius: 3,
                                    borderBottomRightRadius: 3,
                                    backgroundColor: "#2F97FF",
                                    boxShadow: "1px 0 rgba(47, 151, 255, 0.4)",
                                },
                            })}
                        >
                            <Grid container direction="column" justify="center" alignItems="center">
                                <Grid item>
                                    <ListItemIcon>
                                        <Grid container justify="center" alignItems="center">
                                            <Grid item>
                                                <Icon/>
                                            </Grid>
                                        </Grid>
                                    </ListItemIcon>
                                </Grid>
                                <Grid item>
                                    <Typography
                                        css={theme => ({
                                            color: theme.colors.darkGray,
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
            </div>
        </Drawer>
    );
};
