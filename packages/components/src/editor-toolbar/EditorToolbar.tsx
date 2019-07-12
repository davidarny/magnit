/** @jsx jsx */

import * as React from "react";
import { Grid, IconButton, Paper } from "@material-ui/core";
import { jsx } from "@emotion/core";

interface IPuzzleToolbarProps {
    right?: number;
    top?: number;
    items: Array<{
        label: string;
        icon: React.ReactNode;
        action(...args: any[]): any;
    }>;
}

export const EditorToolbar: React.FC<IPuzzleToolbarProps> = ({ right = 0, top = 0, ...props }) => {
    return (
        <Paper
            css={theme => ({
                position: "absolute",
                right: `calc(-${theme.spacing(10)} + ${right}px)`,
                marginBottom: theme.spacing(4),
                top: 0,
                transform: `translateY(${top}px)`,
                transition: "transform 0.3s ease-in-out !important",
                boxShadow: "0px 0px 16px #bfc8d2 !important",
            })}
            className="toolbar"
        >
            <Grid
                container
                direction="column"
                alignItems="center"
                justify="center"
                css={theme => ({ padding: theme.spacing() })}
            >
                {props.items.map(({ label, action, icon }, index) => (
                    <Grid item css={theme => ({ marginBottom: theme.spacing() })} key={index}>
                        <Grid container justify="center" alignItems="center">
                            <IconButton color="primary" aria-label={label} onClick={action}>
                                {icon}
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};
