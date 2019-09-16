/** @jsx jsx */

import { jsx } from "@emotion/core";
import { DateField, StepperWrapper } from "@magnit/components";
import { IExtendedTask } from "@magnit/entities";
import { getFriendlyDate } from "@magnit/services";
import * as React from "react";

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

    return (
        <StepperWrapper
            onTitleChange={onChangeStageTitle}
            onTitleBlur={onBlurStage}
            onStepDelete={onDeleteStage}
            steps={(task.stages || []).map(stage => {
                const safeStageDeadline = stage.deadline || stageDeadlineMap.get(stage.id) || "";
                const deadline = !stage.editable
                    ? getFriendlyDate(new Date(safeStageDeadline))
                    : safeStageDeadline;
                const safeStageTitle = stage.title || stageTitleMap.get(stage.id) || "";
                return {
                    id: stage.id,
                    editable: stage.editable,
                    completed: stage.finished,
                    title: safeStageTitle,
                    content: (
                        <DateField
                            key={stage.id}
                            disabled={!stage.editable}
                            onChange={event => onChangeStageDeadline(stage.id, event.target.value)}
                            onBlur={onBlurStage}
                            value={deadline}
                        />
                    ),
                };
            })}
        />
    );
};

TaskStepper.displayName = "TaskStepper";
