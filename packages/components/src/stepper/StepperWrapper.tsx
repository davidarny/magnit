/** @jsx jsx */

import { FC, ReactNode } from "react";
import { Step, StepContent, StepLabel, Stepper } from "@material-ui/core";
import { jsx } from "@emotion/core";
import * as React from "react";

export interface IStep {
    completed?: boolean;
    content: ReactNode;
    title: string | ReactNode;
}

interface IStepperWrapperProps {
    steps: IStep[];
}

type TStepperProps = IStepperWrapperProps & Partial<React.ComponentProps<typeof Stepper>>;

export const StepperWrapper: FC<TStepperProps> = ({ steps }) => {
    return (
        <Stepper orientation="vertical">
            {steps.map(({ completed, content, title }, index) => (
                <Step key={index} completed={completed}>
                    <StepLabel
                        css={theme => ({
                            svg: {
                                color: `${theme.colors.primary} !important`,
                            },
                        })}
                    >
                        {title}
                    </StepLabel>
                    <StepContent>{content}</StepContent>
                </Step>
            ))}
        </Stepper>
    );
};
