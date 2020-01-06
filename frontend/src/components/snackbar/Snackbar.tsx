/** @jsx jsx */

import { jsx } from "@emotion/core";
import { IconButton, Snackbar as MaterialSnackbar, SnackbarContent } from "@material-ui/core";
import {
    CheckCircle as CheckCircleIcon,
    Close as CloseIcon,
    Error as ErrorIcon,
} from "@material-ui/icons";
import * as React from "react";

interface ISnackbarProps {
    message: string;
    open: boolean;
    error: boolean;

    onClose?(event?: React.SyntheticEvent, reason?: string): void;
}

export const Snackbar: React.FC<ISnackbarProps> = ({ message, error, open, onClose }) => {
    return (
        <MaterialSnackbar
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            open={open}
            autoHideDuration={2500}
            onClose={onClose}
        >
            <SnackbarContent
                css={({ colors }) => ({
                    background: error ? colors.red : colors.green,
                    boxShadow: `0 4px 8px ${error ? colors.red : colors.green}50`,
                })}
                message={
                    <span
                        css={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {error ? (
                            <ErrorIcon css={({ spacing }) => ({ marginRight: spacing(1) })} />
                        ) : (
                            <CheckCircleIcon css={({ spacing }) => ({ marginRight: spacing(1) })} />
                        )}
                        {message}
                    </span>
                }
                action={[
                    <IconButton key="close" color="inherit" onClick={onClose}>
                        <CloseIcon />
                    </IconButton>,
                ]}
            />
        </MaterialSnackbar>
    );
};

Snackbar.displayName = "Snackbar";
