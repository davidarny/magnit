/** @jsx jsx */

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
    completed?: boolean;
    id: string;
    content: React.ReactNode;
    title: string;
    editable?: boolean;
}

interface IStepperWrapperProps {
    steps: IStep[];

    onTitleChange?(id: string, value: string): void;

    onStepDelete?(id: string): void;
}

type TStepperProps = IStepperWrapperProps & Partial<React.ComponentProps<typeof Stepper>>;

export const StepperWrapper: React.FC<TStepperProps> = ({ steps, ...props }) => {
    return (
        <Stepper orientation="vertical">
            {steps.map(({ completed, title, content, editable, id }) => (
                <Step active={true} key={id} completed={completed}>
                    <StepLabel
                        css={theme => ({ svg: { color: `${theme.colors.primary} !important` } })}
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
                                        onChange={event => {
                                            if (props.onTitleChange) {
                                                props.onTitleChange(id, event.target.value);
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs>
                                    <IconButton
                                        css={theme => ({
                                            svg: { color: `${theme.colors.gray} !important` },
                                        })}
                                        onClick={() => {
                                            if (props.onStepDelete) {
                                                props.onStepDelete(id);
                                            }
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        )}
                    </StepLabel>
                    <StepContent>{content}</StepContent>
                </Step>
            ))}
        </Stepper>
    );
};
