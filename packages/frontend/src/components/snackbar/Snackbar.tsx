/** @jsx jsx */

import * as React from "react";
import { IconButton, Snackbar as MaterialSnackbar, SnackbarContent } from "@material-ui/core";
import { css, jsx } from "@emotion/core";
import {
    CheckCircle as CheckCircleIcon,
    Close as CloseIcon,
    Error as ErrorIcon,
} from "@material-ui/icons";

interface ISnackbarProps {
    messages: {
        success: string;
        error: string;
    };
    open: boolean;
    error: boolean;

    onClose?(event?: React.SyntheticEvent, reason?: string): void;
}

export const Snackbar: React.FC<ISnackbarProps> = ({ messages, error, open, ...props }) => {
    return (
        <MaterialSnackbar
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            open={open}
            autoHideDuration={5000}
            onClose={props.onClose}
        >
            <SnackbarContent
                css={theme => ({
                    background: error ? theme.colors.red : theme.colors.green,
                    boxShadow: `0 4px 8px ${error ? theme.colors.red : theme.colors.green}50`,
                })}
                message={
                    <span
                        css={css`
                            display: flex;
                            align-items: center;
                        `}
                    >
                        {error ? (
                            <ErrorIcon css={theme => ({ marginRight: theme.spacing(1) })} />
                        ) : (
                            <CheckCircleIcon css={theme => ({ marginRight: theme.spacing(1) })} />
                        )}
                        {error ? messages.error : messages.success}
                    </span>
                }
                action={[
                    <IconButton key="close" color="inherit" onClick={props.onClose}>
                        <CloseIcon />
                    </IconButton>,
                ]}
            />
        </MaterialSnackbar>
    );
};
