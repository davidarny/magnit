/** @jsx jsx */

import { FC, ReactNode } from "react";
import { Stepper, Step, StepLabel, StepContent } from "@material-ui/core";
import { jsx } from "@emotion/core";

export interface IStep {
    completed?: boolean;
    content: ReactNode;
    title: string | ReactNode;
}

interface IStepperWrapperProps {
    steps: IStep[];
}

export const StepperWrapper: FC<IStepperWrapperProps> = ({ steps }) => {
    return (
        <Stepper orientation="vertical">
            {steps.map(({ completed, content, title }, index) => (
                <Step key={index} completed={completed}>
                    <StepLabel>{title}</StepLabel>
                    <StepContent>{content}</StepContent>
                </Step>
            ))}
        </Stepper>
    );
};
