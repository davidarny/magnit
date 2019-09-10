/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Grid, IconButton, Paper } from "@material-ui/core";
import * as React from "react";

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
                boxShadow: `0 0 ${theme.spacing(2)} ${theme.colors.shadowGray} !important`,
                color: theme.colors.primary,
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
                {props.items.map(({ label, action, icon }, index, array) => (
                    <Grid
                        item
                        css={theme => ({
                            marginBottom: index === array.length - 1 ? 0 : theme.spacing(),
                        })}
                        key={index}
                    >
                        <Grid container justify="center" alignItems="center">
                            <IconButton color="inherit" onClick={action}>
                                {icon}
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};
