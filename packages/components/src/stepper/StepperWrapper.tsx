/** @jsx jsx */

import { jsx } from "@emotion/core";
import {
    Grid,
    IconButton,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    Typography,
} from "@material-ui/core";
import { Close as DeleteIcon } from "@material-ui/icons";
import { InputField } from "fields";
import * as React from "react";
import { useCallback } from "react";

export interface IStep {
    id: number;
    completed?: boolean;
    content: React.ReactNode;
    title: string;
    editable?: boolean;
}

interface IStepperWrapperProps {
    steps: IStep[];

    onTitleBlur?(id: number): void;

    onTitleChange?(id: number, value: string): void;

    onStepDelete?(id: number): void;
}

type TStepperProps = IStepperWrapperProps & Partial<React.ComponentProps<typeof Stepper>>;

export const StepperWrapper: React.FC<TStepperProps> = props => {
    const { steps, onTitleBlur, onTitleChange, onStepDelete } = props;

    return (
        <Stepper orientation="vertical">
            {steps.map(({ completed, title, content, editable, id }) => (
                <StepWrapper
                    key={id}
                    editable={editable}
                    completed={completed}
                    content={content}
                    id={id}
                    title={title}
                    onTitleChange={onTitleChange}
                    onStepDelete={onStepDelete}
                    onTitleBlur={onTitleBlur}
                />
            ))}
        </Stepper>
    );
};

StepperWrapper.displayName = "StepperWrapper";

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
                                css={theme => ({
                                    input: { fontSize: theme.fontSize.larger },
                                })}
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
