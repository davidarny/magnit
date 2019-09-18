/** @jsx jsx */

import { jsx } from "@emotion/core";
import { DateField, IStep, StepperWrapper } from "@magnit/components";
import { IExtendedTask } from "@magnit/entities";
import { getFriendlyDate } from "@magnit/services";
import * as React from "react";
import { useMemo } from "react";

interface ITaskStepperProps {
    task: Partial<IExtendedTask>;
    stageDeadlineMap: Map<number, string>;
    stageTitleMap: Map<number, string>;

    onChangeStageTitle(id: number, value: string): void;

    onChangeStageDeadline(id: number, value: string): void;

    onBlurStage(): void;

    onDeleteStage(id: number): void;
}

export const TaskStepper: React.FC<ITaskStepperProps> = props => {
    const { task, stageDeadlineMap, stageTitleMap } = props;
    const { onChangeStageDeadline, onBlurStage, onChangeStageTitle, onDeleteStage } = props;

    const stages = (task.stages || []).map((stage, index) => ({ ...stage, __index: index + 1 }));
    const addingNewStage = stages.reduce((prev, curr) => (!prev ? !!curr.editable : prev), false);

    const steps = useMemo(
        () =>
            (!addingNewStage
                ? // only last step
                  [stages[stages.length - 1]]
                : // last step + new editable
                  [stages[stages.length - 2], stages[stages.length - 1]]
            )
                .map(stage => {
                    if (!stage) {
                        return;
                    }

                    function onChangeDeadline(event: React.ChangeEvent<HTMLInputElement>) {
                        onChangeStageDeadline(stage.id, event.target.value);
                    }

                    const deadline = stage.deadline || stageDeadlineMap.get(stage.id) || "";
                    const date = !stage.editable ? getFriendlyDate(new Date(deadline)) : deadline;
                    const title = stage.title || stageTitleMap.get(stage.id) || "";

                    return {
                        ...stage,
                        title,
                        completed: stage.finished,
                        content: (
                            <DateField
                                key={stage.id}
                                disabled={!stage.editable}
                                onChange={onChangeDeadline}
                                onBlur={onBlurStage}
                                value={date}
                            />
                        ),
                    };
                })
                .filter(Boolean) as IStep[],
        [
            addingNewStage,
            onBlurStage,
            onChangeStageDeadline,
            stageDeadlineMap,
            stageTitleMap,
            stages,
        ],
    );

    return (
        <StepperWrapper
            onTitleChange={onChangeStageTitle}
            onTitleBlur={onBlurStage}
            onStepDelete={onDeleteStage}
            steps={steps}
        />
    );
};

TaskStepper.displayName = "TaskStepper";
