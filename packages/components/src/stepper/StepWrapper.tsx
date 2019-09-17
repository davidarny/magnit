/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Grid, IconButton, Step, StepContent, StepLabel, Typography } from "@material-ui/core";
import { Close as DeleteIcon } from "@material-ui/icons";
import { InputField } from "fields";
import * as React from "react";
import { useCallback } from "react";
import { IStep } from "./StepperWrapper";

interface IStepWrapperProps extends IStep {
    onTitleBlur?(id: number): void;

    onTitleChange?(id: number, value: string): void;

    onStepDelete?(id: number): void;
}

export const StepWrapper: React.FC<IStepWrapperProps> = props => {
    const {
        id,
        completed,
        content,
        title,
        editable,
        onStepDelete,
        onTitleChange,
        onTitleBlur,
        __index,
        ...rest
    } = props;

    const onClickCallback = useCallback(() => {
        if (onStepDelete) {
            onStepDelete(id);
        }
    }, [id, onStepDelete]);

    const onChangeCallback = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (onTitleChange) {
                onTitleChange(id, event.target.value);
            }
        },
        [id, onTitleChange],
    );

    const onBlurCallback = useCallback(() => {
        if (onTitleBlur) {
            onTitleBlur(id);
        }
    }, [id, onTitleBlur]);

    return (
        <Step {...rest} active={true} completed={completed}>
            <StepLabel
                {...(__index ? { icon: __index } : {})}
                css={theme => ({
                    svg: { color: `${theme.colors.primary} !important` },
                })}
            >
                {!editable && (
                    <Typography css={theme => ({ fontSize: theme.fontSize.large })}>
                        {title}
                    </Typography>
                )}
                {editable && (
                    <Grid container>
                        <Grid item xs={10}>
                            <InputField
                                fullWidth
                                css={theme => ({ input: { fontSize: theme.fontSize.larger } })}
                                value={title}
                                onChange={onChangeCallback}
                                onBlur={onBlurCallback}
                            />
                        </Grid>
                        <Grid item xs>
                            <IconButton
                                css={theme => ({
                                    svg: { color: `${theme.colors.gray} !important` },
                                })}
                                onClick={onClickCallback}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                )}
            </StepLabel>
            <StepContent>{content}</StepContent>
        </Step>
    );
};

StepWrapper.displayName = "StepWrapper";
