/** @jsx jsx */
import { SelectableBlockWrapper } from "@magnit/components";
import { CheckIcon } from "@magnit/icons";
import { Grid } from "@material-ui/core";
import * as React from "react";
import { jsx } from "@emotion/core";

interface IProps {
    children: React.ReactNodeArray | React.ReactNode;
    isFocused?: boolean;
    isChecked?: boolean;
    number?: number;
    isFirst?: boolean;
    isLast?: boolean;
    onMouseDown?: () => void;
    onFocus?: () => void;
}

export const HistoryLineItem: React.FC<IProps> = props => {
    return (
        <SelectableBlockWrapper
            css={theme => ({
                padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
                "&:hover": { background: theme.colors.light },
                zIndex: props.isFocused ? 1300 : "initial",
            })}
            focused={props.isFocused}
            onMouseDown={props.onMouseDown}
            onFocus={props.onFocus}
        >
            <Grid container spacing={2} css={() => ({ position: "relative" })}>
                <Grid item css={theme => ({ position: "relative" })}>
                    <div
                        css={theme => ({
                            width: theme.spacing(3),
                            height: theme.spacing(3),
                            borderRadius: "50%",
                            border: `2px solid ${theme.colors.primary}`,
                            zIndex: 2,
                            color: props.isChecked ? theme.colors.white : "initial",
                            background: props.isChecked ? theme.colors.primary : theme.colors.white,
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        })}
                    >
                        {props.isChecked && <CheckIcon />}
                        {!props.isChecked && props.number && (
                            <div
                                css={theme => ({
                                    fontSize: theme.fontSize.small,
                                    color: theme.colors.primary,
                                })}
                            >
                                {props.number}
                            </div>
                        )}
                    </div>
                    {!props.isFirst && (
                        <div
                            css={theme => ({
                                width: theme.spacing(0.25),
                                height: theme.spacing(3),
                                background: theme.colors.lightGray,
                                position: "absolute",
                                top: theme.spacing(-2),
                                left: 0,
                                right: 0,
                                margin: "auto",
                                zIndex: 1,
                            })}
                        />
                    )}
                    {!props.isLast && (
                        <div
                            css={theme => ({
                                width: theme.spacing(0.25),
                                height: `calc(100% - ${theme.spacing(2)})`,
                                background: theme.colors.lightGray,
                                position: "absolute",
                                top: theme.spacing(4),
                                left: 0,
                                right: 0,
                                margin: "auto",
                                zIndex: 1,
                            })}
                        />
                    )}
                </Grid>
                <Grid item>{props.children}</Grid>
            </Grid>
        </SelectableBlockWrapper>
    );
};
