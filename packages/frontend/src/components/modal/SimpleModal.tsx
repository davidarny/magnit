/** @jsx jsx */
import { Close } from "@material-ui/icons";
import * as React from "react";
import { jsx } from "@emotion/core";
import Modal from "@material-ui/core/Modal";

interface IProps {
    open?: boolean;
    children: React.ReactElement;
    width?: number | string;
    onClose(): void;
}

export const SimpleModal: React.FC<IProps> = props => {
    return (
        <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={!!props.open}
            onClose={props.onClose}
        >
            <div
                css={theme => ({
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    padding: theme.spacing(6),
                    maxWidth: "100%",
                    backgroundColor: theme.colors.white,
                    width: props.width || theme.spacing(6),
                    borderRadius: 6,
                })}
            >
                <div
                    css={theme => ({
                        fontSize: theme.fontSize.xxLarge,
                        position: "absolute",
                        top: "-.5em",
                        right: "-.5em",
                        color: theme.colors.white,
                        backgroundColor: theme.colors.gray,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "1em",
                        height: "1em",
                        cursor: "pointer",
                    })}
                    onClick={props.onClose}
                >
                    <Close css={theme => ({ fontSize: theme.fontSize.small })} />
                </div>
                {props.children}
            </div>
        </Modal>
    );
};
