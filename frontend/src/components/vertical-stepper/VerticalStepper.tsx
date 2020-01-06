/** @jsx jsx */

import { jsx } from "@emotion/core";
import { SelectableBlockWrapper } from "@magnit/components";
import { CheckIcon } from "@magnit/icons";
import { Grid } from "@material-ui/core";
import * as React from "react";

interface IVerticalStepperProps {
    focused?: boolean;
    checked?: boolean;
    index?: number;
    first?: boolean;
    last?: boolean;

    onMouseDown?(): void;

    onFocus?(): void;
}

export const VerticalStepper: React.FC<IVerticalStepperProps> = props => {
    const { index, onMouseDown, onFocus, focused, last, checked, first, children } = props;
    return (
        <SelectableBlockWrapper
            css={theme => ({
                padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
                "&:hover": { background: theme.colors.light },
                zIndex: focused ? 1300 : "initial",
            })}
            focused={focused}
            onMouseDown={onMouseDown}
            onFocus={onFocus}
        >
            <Grid container spacing={2}>
                <Grid item css={{ position: "relative" }}>
                    <div
                        css={theme => ({
                            width: theme.spacing(3),
                            height: theme.spacing(3),
                            borderRadius: "50%",
                            border: `2px solid ${theme.colors.primary}`,
                            zIndex: 2,
                            color: checked ? theme.colors.white : "initial",
                            background: checked ? theme.colors.primary : theme.colors.white,
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        })}
                    >
                        {checked && <CheckIcon />}
                        {!checked && index && (
                            <div
                                css={theme => ({
                                    fontSize: theme.fontSize.small,
                                    color: theme.colors.primary,
                                })}
                            >
                                {index}
                            </div>
                        )}
                    </div>
                    {!first && (
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
                    {!last && (
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
                <Grid item>{children}</Grid>
            </Grid>
        </SelectableBlockWrapper>
    );
};

VerticalStepper.displayName = "VerticalStepper";
