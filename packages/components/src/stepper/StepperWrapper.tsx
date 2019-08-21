/** @jsx jsx */

import * as _ from "lodash";
import { useCallback } from "react";
import * as React from "react";
import {
    Grid,
    IconButton,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    Typography,
} from "@material-ui/core";
import { jsx } from "@emotion/core";
import { InputField } from "fields";
import { Close as DeleteIcon } from "@material-ui/icons";

export interface IStep {
    id: number;
    completed?: boolean;
    content: React.ReactNode;
    title: string;
    editable?: boolean;
}

interface IStepperWrapperProps {
    steps: IStep[];

    onTitleChange?(id: number, value: string): void;

    onStepDelete?(id: number): void;
}

type TStepperProps = IStepperWrapperProps & Partial<React.ComponentProps<typeof Stepper>>;

export const StepperWrapper: React.FC<TStepperProps> = ({ steps, ...props }) => {
    return (
        <Stepper orientation="vertical">
            {steps.map(({ completed, title, content, editable, id }) => (
                <StepWrapper
                    editable={editable}
                    completed={completed}
                    content={content}
                    id={id}
                    title={title}
                    onTitleChange={props.onTitleChange || _.noop}
                    onStepDelete={props.onStepDelete || _.noop}
                />
            ))}
        </Stepper>
    );
};

interface IStepWrapperProps extends IStep {
    onTitleChange(id: number, value: string): void;

    onStepDelete(id: number): void;
}

export const StepWrapper: React.FC<IStepWrapperProps> = props => {
    const { id, completed, content, title, editable, onStepDelete, onTitleChange } = props;

    const onClick = useCallback(() => onStepDelete(id), [id, onStepDelete]);

    const onChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => onTitleChange(id, event.target.value),
        [id, onTitleChange],
    );

    return (
        <Step active={true} completed={completed}>
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
                                onChange={onChange}
                            />
                        </Grid>
                        <Grid item xs>
                            <IconButton
                                css={theme => ({
                                    svg: { color: `${theme.colors.gray} !important` },
                                })}
                                onClick={onClick}
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
