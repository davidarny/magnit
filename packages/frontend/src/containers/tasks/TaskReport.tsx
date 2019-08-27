/** @jsx jsx */

import { jsx } from "@emotion/core";
import { getFriendlyDate } from "@magnit/services";
import { Grid, IconButton, Menu, MenuItem, Typography } from "@material-ui/core";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";
import { HistoryLineItem } from "components/history-line";
import { SimpleModal } from "components/modal";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import {
    IReport,
    SendReportForm,
    TaskReportHeader,
    TaskReportItem,
} from "containers/tasks/task-report";
import { useContext, useEffect, useState } from "react";
import * as React from "react";
import { AppContext } from "context";

const reportHeaderFields = [
    {
        title: "АДМИНИСТРАТОР",
        text: "Andrey_555",
    },
    {
        title: "МЕСТОПОЛОЖЕНИЕ",
        text: "Челябинская область, Челябинск, улица Железная, 5",
    },
    {
        title: "ФОРМАТ ОБЪЕКТА",
        text: "МК",
    },
    {
        title: "ДАТА СОЗДАНИЯ",
        text: getFriendlyDate(new Date()),
    },
    {
        title: "СТАТУС",
        text: "В работе",
    },
];

interface ITaskReportProps {
    taskId: number;
}

export const TaskReport: React.FC<ITaskReportProps> = ({ taskId }) => {
    const [reports, setReports] = useState<IReport[]>([]);
    const [focusedBlockId, setFocusedBlockId] = useState(-1);
    const [menuAnchorElement, setMenuAnchorElement] = useState<null | HTMLElement>(null);
    const [sendReportModal, setSendReportModal] = useState(false);
    const context = useContext(AppContext);

    useEffect(() => {
        // mock report data
        setReports([
            {
                number: 1,
                name: "Ведомость работ",
                createdAt: getFriendlyDate(new Date()),
                correctionCount: 8,
            },
            {
                number: 2,
                name: "Бриф",
                createdAt: getFriendlyDate(new Date()),
                correctionCount: 8,
            },
            {
                number: 3,
                name: "Инженерное заключение",
                createdAt: getFriendlyDate(new Date()),
                correctionCount: 0,
            },
        ]);
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
        // send report on email
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
                <TaskReportHeader fields={reportHeaderFields} />

                {/* Report line */}
                <Typography
                    css={theme => ({
                        fontSize: theme.fontSize.large,
                        paddingLeft: theme.spacing(4),
                        paddingRight: theme.spacing(4),
                        paddingBottom: theme.spacing(),
                        paddingTop: theme.spacing(5),
                        backgroundColor: theme.colors.white,
                    })}
                >
                    Этапы работы
                </Typography>

                {/* mock report items */}
                {[1, 2, 3, 4, 5].map(item => {
                    return (
                        <HistoryLineItem
                            key={item}
                            number={item}
                            isChecked={item % 2 === 0}
                            isFocused={focusedBlockId === item}
                            onMouseDown={() => setFocusedBlockId(item)}
                            onFocus={() => setFocusedBlockId(item)}
                            isFirst={item === 1}
                            isLast={item === 5}
                        >
                            <TaskReportItem reportTableData={reports} />
                        </HistoryLineItem>
                    );
                })}
            </Grid>
        </SectionLayout>
    );
};
