/** @jsx jsx */

import { jsx } from "@emotion/core";
import { SelectableBlockWrapper } from "@magnit/components";
import { CheckIcon } from "@magnit/icons";
import { getFriendlyDate } from "@magnit/services";
import { Grid, Typography } from "@material-ui/core";
import { EmptyList } from "components/list";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { AppContext } from "context";
import * as _ from "lodash";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { getStagesWithFullHistory, IStageResponse } from "services/api/tasks";

interface ITaskHistoryProps {
    taskId: number;
}

export const TaskHistory: React.FC<ITaskHistoryProps> = ({ taskId }) => {
    const [stages, setStages] = useState<IStageResponse[]>([]);
    const [focusedBlockId, setFocusedBlockId] = useState(-1);
    const context = useContext(AppContext);

    useEffect(() => {
        getStagesWithFullHistory(context.courier, taskId)
            .then(response => {
                setFocusedBlockId((_.last(response.stages) || { id: -1 }).id);
                setStages(response.stages);
            })
            .catch(console.error);
    }, [context.courier, taskId]);

    return (
        <SectionLayout>
            <SectionTitle title="История изменений" />
            {!stages.length && <EmptyList title="Нет истории" />}
            <Grid
                css={theme => ({
                    maxWidth: theme.maxTemplateWidth,
                    margin: theme.spacing(4),
                    position: "relative",
                })}
            >
                {stages.map((stage, index) => {
                    function onSelectableBlockFocus(): void {
                        setFocusedBlockId(stage.id);
                    }

                    const last = index === stages.length - 1;

                    return (
                        <SelectableBlockWrapper
                            key={stage.id}
                            css={theme => ({
                                padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
                                "&:hover": {
                                    background: theme.colors.light,
                                    "> div:last-child": { background: theme.colors.light },
                                },
                                zIndex: focusedBlockId === stage.id ? 1300 : "initial",
                            })}
                            focused={focusedBlockId === stage.id}
                            onMouseDown={onSelectableBlockFocus}
                            onFocus={onSelectableBlockFocus}
                        >
                            <Grid container spacing={2} css={{ position: "relative" }}>
                                <Grid item>
                                    <Grid container justify="flex-end">
                                        <div
                                            css={theme => ({
                                                width: theme.spacing(3),
                                                height: theme.spacing(3),
                                                borderRadius: "50%",
                                                border: `2px solid ${theme.colors.primary}`,
                                                zIndex: 1500,
                                                color: stage.finished
                                                    ? theme.colors.white
                                                    : "initial",
                                                position: "relative",
                                                background: stage.finished
                                                    ? theme.colors.primary
                                                    : theme.colors.white,
                                            })}
                                        >
                                            {stage.finished && <CheckIcon />}
                                        </div>
                                        {!last && (
                                            <div
                                                css={theme => ({
                                                    width: theme.spacing(0.25),
                                                    height: `calc(100% + ${theme.spacing()})`,
                                                    background: theme.colors.lightGray,
                                                    position: "absolute",
                                                    top: theme.spacing(4),
                                                    left: "20.5px", // TODO: dynamic calculation
                                                    zIndex: 1400,
                                                })}
                                            />
                                        )}
                                    </Grid>
                                </Grid>
                                <Grid item xs={7}>
                                    <Typography
                                        component="span"
                                        css={theme => ({ fontSize: theme.fontSize.larger })}
                                    >
                                        {stage.title}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography
                                        css={theme => ({
                                            textAlign: "end",
                                            color: theme.colors.secondary,
                                        })}
                                    >
                                        {getFriendlyDate(new Date(stage.deadline))}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    {(stage.history || []).map(history => (
                                        <Grid container spacing={3} key={history.id}>
                                            <Grid item>
                                                <div
                                                    css={theme => ({
                                                        width: theme.spacing(3),
                                                        height: theme.spacing(3),
                                                        visibility: "hidden",
                                                    })}
                                                />
                                            </Grid>
                                            <Grid item xs={1}>
                                                <Typography
                                                    css={theme => ({
                                                        textAlign: "end",
                                                        color: theme.colors.secondary,
                                                    })}
                                                >
                                                    {getFriendlyDate(new Date(history.createdAt))}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={10}>
                                                <Typography>{history.description}</Typography>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </SelectableBlockWrapper>
                    );
                })}
            </Grid>
        </SectionLayout>
    );
};
