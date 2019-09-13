/** @jsx jsx */

import { jsx } from "@emotion/core";
import {
    Dialog as MaterialDialog,
    DialogActions,
    DialogContent,
    DialogContentText,
} from "@material-ui/core";
import { Button } from "button";
import React from "react";

export interface IDialogProps {
    open: boolean;

    onClose?(): void;

    onSuccess?(): void;
}

export const Dialog: React.FC<IDialogProps> = props => {
    const { open, onClose, onSuccess, children } = props;

    return (
        <MaterialDialog
            classes={{ paper: "paper" }}
            css={theme => ({
                ".paper": {
                    padding: theme.spacing(3),
                    paddingLeft: theme.spacing(5),
                    position: "absolute",
                    top: theme.spacing(10),
                    margin: 0,
                    right: 0,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                },
            })}
            open={open}
            onClose={onClose}
        >
            <div
                css={theme => ({
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: "5px",
                    background: theme.colors.darkYellow,
                })}
            />
            <DialogContent css={{ paddingLeft: 0 }}>
                <DialogContentText>{children}</DialogContentText>
            </DialogContent>
            <DialogActions css={{ justifyContent: "flex-start", paddingLeft: 0 }}>
                <Button onClick={onSuccess} scheme="blue" variant="contained" autoFocus>
                    Да
                </Button>
                <Button onClick={onClose} scheme="gray">
                    Отмена
                </Button>
            </DialogActions>
        </MaterialDialog>
    );
};
