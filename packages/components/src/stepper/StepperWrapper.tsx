/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Stepper } from "@material-ui/core";
import * as React from "react";
import { StepWrapper } from "./StepWrapper";

export interface IStep {
    id: number;
    completed?: boolean;
    content: React.ReactNode;
    title: string;
    editable?: boolean;
    __index?: number;
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
            {steps.map(({ completed, title, content, editable, id, __index }) => (
                <StepWrapper
                    key={id}
                    editable={editable}
                    completed={completed}
                    content={content}
                    id={id}
                    title={title}
                    __index={__index}
                    onTitleChange={onTitleChange}
                    onStepDelete={onStepDelete}
                    onTitleBlur={onTitleBlur}
                />
            ))}
        </Stepper>
    );
};

StepperWrapper.displayName = "StepperWrapper";
