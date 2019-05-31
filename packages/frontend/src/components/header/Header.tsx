/** @jsx jsx */

import { jsx, css } from "@emotion/core";
import { AppBar, Toolbar, IconButton, Typography, Button } from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import React from "react";

const Header: React.FC = () => {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="Menu"
                        css={theme => ({
                            marginRight: theme.spacing(2),
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        css={css`
                            flex-grow: 1;
                        `}
                    >
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default Header;
