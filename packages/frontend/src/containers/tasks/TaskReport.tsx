/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Grid, IconButton, Menu, MenuItem, Typography } from "@material-ui/core";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";
import { SimpleModal } from "components/modal";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { ReportHeader, ReportStage, SendReportForm } from "components/task-report";
import { VerticalStepper } from "components/vertical-stepper";
import { AppContext } from "context";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { getTaskReport, IReportResponse, sendReportToEmail } from "services/api/tasks";

interface ITaskReportProps {
    taskId: number;
}

export const TaskReport: React.FC<ITaskReportProps> = ({ taskId }) => {
    const context = useContext(AppContext);

    const [focusedBlockId, setFocusedBlockId] = useState(-1);
    const [menuAnchorElement, setMenuAnchorElement] = useState<null | HTMLElement>(null);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [report, setReport] = useState<IReportResponse | null>(null);

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
        setReportModalOpen(true);
    }
    function onSubmitSendReport(email: string) {
        setReportModalOpen(false);
        sendReportToEmail(context.courier, taskId, email)
            .then(() =>
                context.setSnackbarState({
                    open: true,
                    message: `Отчёт отправлен на ${email}`,
                }),
            )
            .catch(() => {
                context.setSnackbarError(true);
                context.setSnackbarState({
                    open: true,
                    message: `Не удалось отправить отчёт на ${email}`,
                });
            });
    }

    function onPopupClose() {
        setReportModalOpen(false);
    }

    return (
        <SectionLayout>
            <SimpleModal width={370} open={reportModalOpen} onClose={onPopupClose}>
                <SendReportForm onSubmit={onSubmitSendReport} />
            </SimpleModal>
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
