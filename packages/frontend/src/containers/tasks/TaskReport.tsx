/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Grid, IconButton, Menu, MenuItem, Typography } from "@material-ui/core";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";
import { HistoryLineItem } from "components/history-line";
import { SimpleModal } from "components/modal";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import {
    SendReportForm,
    TaskReportHeader,
    TaskReportStageItem,
} from "containers/tasks/task-report";
import { useContext, useEffect, useState } from "react";
import * as React from "react";
import { AppContext } from "context";
import { getTaskReport, IReportResponse } from "services/api/tasks";

interface ITaskReportProps {
    taskId: number;
}

export const TaskReport: React.FC<ITaskReportProps> = ({ taskId }) => {
    const [focusedBlockId, setFocusedBlockId] = useState(-1);
    const [menuAnchorElement, setMenuAnchorElement] = useState<null | HTMLElement>(null);
    const [sendReportModal, setSendReportModal] = useState(false);
    const [report, setReport] = useState<IReportResponse>();
    const context = useContext(AppContext);

    useEffect(() => {
        getTaskReport(context.courier, taskId).then(response => setReport(response.report));
    }, [context.courier, taskId]);

    function onMenuClick(event: React.MouseEvent<HTMLButtonElement>) {
        setMenuAnchorElement(event.currentTarget);
    }
    function onMenuClose() {
        setMenuAnchorElement(null);
    }
    function onOpenSendReportMenuItem() {
        onMenuClose();
        setSendReportModal(true);
    }
    function onSubmitSendReport(email: string) {
        // send report to email
    }

    return (
        <SectionLayout>
            {/* Send report popup */}
            <SimpleModal
                width={370}
                open={sendReportModal}
                onClose={() => setSendReportModal(false)}
            >
                <SendReportForm onSubmit={onSubmitSendReport} />
            </SimpleModal>

            {/* Top bar */}
            <SectionTitle title="Отчет по заданию">
                <Grid item>
                    <IconButton onClick={onMenuClick}>
                        <MoreVertIcon />
                    </IconButton>
                </Grid>
                <Menu
                    keepMounted
                    open={Boolean(menuAnchorElement)}
                    anchorEl={menuAnchorElement}
                    onClose={onMenuClose}
                >
                    <MenuItem onClick={onMenuClose}>Скачать отчет (.xls)</MenuItem>
                    <MenuItem onClick={onOpenSendReportMenuItem}>Отправить на email</MenuItem>
                </Menu>
            </SectionTitle>

            <Grid
                css={theme => ({
                    maxWidth: theme.maxTemplateWidth,
                    margin: theme.spacing(4),
                    position: "relative",
                })}
            >
                {/* Report headers */}
                {report && <TaskReportHeader title={report.title} report={report} />}

                <Typography
                    css={theme => ({
                        fontSize: theme.fontSize.large,
                        padding: `
                            ${theme.spacing(5)}
                            ${theme.spacing(4)}
                            ${theme.spacing()}
                        `,
                        backgroundColor: theme.colors.white,
                    })}
                >
                    Этапы работы
                </Typography>

                {/* Report stages */}
                {report &&
                    report.stages.map((stage, stageIndex) => {
                        const friendlyIndex = stageIndex + 1;
                        return (
                            <HistoryLineItem
                                key={stage.id}
                                index={friendlyIndex}
                                isChecked={stage.finished}
                                isFocused={focusedBlockId === stage.id}
                                onMouseDown={() => setFocusedBlockId(stage.id)}
                                onFocus={() => setFocusedBlockId(stage.id)}
                                isFirst={!stageIndex}
                                isLast={friendlyIndex === report.stages.length}
                            >
                                <TaskReportStageItem
                                    title={stage.title}
                                    dueDate={stage.dueDate}
                                    templates={stage.templates}
                                />
                            </HistoryLineItem>
                        );
                    })}
            </Grid>
        </SectionLayout>
    );
};
