/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Grid, IconButton, Menu, MenuItem, Typography } from "@material-ui/core";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";
import { SimpleModal } from "components/modal";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { SendReportForm, ReportHeader, ReportStage } from "components/task-report";
import { useContext, useEffect, useState } from "react";
import * as React from "react";
import { AppContext } from "context";
import { getTaskReport, IReportResponse } from "services/api/tasks";
import { VerticalStepper } from "../../components/vertical-stepper";

interface ITaskReportProps {
    taskId: number;
}

export const TaskReport: React.FC<ITaskReportProps> = ({ taskId }) => {
    const [focusedBlockId, setFocusedBlockId] = useState(-1);
    const [menuAnchorElement, setMenuAnchorElement] = useState<null | HTMLElement>(null);
    const [sendReportModal, setSendReportModal] = useState(false);
    const [report, setReport] = useState<IReportResponse | null>(null);
    const context = useContext(AppContext);

    useEffect(() => {
        getTaskReport(context.courier, taskId)
            .then(response => setReport(response.report))
            .catch(console.error);
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
        // TODO: send report to email
    }

    function onPopupClose() {
        setSendReportModal(false);
    }

    return (
        <SectionLayout>
            {/* send report popup */}
            <SimpleModal width={370} open={sendReportModal} onClose={onPopupClose}>
                <SendReportForm onSubmit={onSubmitSendReport} />
            </SimpleModal>

            {/* top bar */}
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
                {/* report headers */}
                {report && <ReportHeader title={report.title} report={report} />}

                {report && report.stages.length > 0 && (
                    <Typography
                        css={({ spacing, fontSize, colors }) => ({
                            fontSize: fontSize.large,
                            padding: ` ${spacing(5)} ${spacing(4)} ${spacing()} `,
                            backgroundColor: colors.white,
                        })}
                    >
                        Этапы работы
                    </Typography>
                )}

                {/* report stages */}
                {report &&
                    report.stages.map((stage, index) => {
                        function onMouseDown() {
                            setFocusedBlockId(stage.id);
                        }

                        function onFocus() {
                            setFocusedBlockId(stage.id);
                        }

                        const friendlyIndex = index + 1;

                        return (
                            <VerticalStepper
                                key={stage.id}
                                index={friendlyIndex}
                                checked={stage.finished}
                                focused={focusedBlockId === stage.id}
                                onMouseDown={onMouseDown}
                                onFocus={onFocus}
                                first={!index}
                                last={friendlyIndex === report.stages.length}
                            >
                                <ReportStage
                                    title={stage.title}
                                    deadline={stage.deadline}
                                    templates={stage.templates}
                                />
                            </VerticalStepper>
                        );
                    })}
            </Grid>
        </SectionLayout>
    );
};
