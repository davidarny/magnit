/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import { IColumn, SelectableBlockWrapper, TableWrapper } from "@magnit/components";
import { CheckIcon } from "@magnit/icons";
import { getFriendlyDate } from "@magnit/services";
import { Grid, IconButton, Menu, MenuItem, Typography } from "@material-ui/core";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { useContext, useEffect, useState } from "react";
import * as React from "react";
import { AppContext } from "context";

const columns: IColumn[] = [
    { key: "number", label: "№" },
    { key: "name", label: "Название шаблона" },
    { key: "createdAt", label: "Дата добавления" },
    { key: "correctionCount", label: "Количество правок" },
];

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

interface IReport {
    number: number;
    name: string;
    createdAt: string;
    correctionCount: number;
}

interface ITaskReportProps {
    taskId: number;
}

export const TaskReport: React.FC<ITaskReportProps> = ({ taskId }) => {
    const [reports, setReports] = useState<IReport[]>([]);
    const [focusedBlockId, setFocusedBlockId] = useState(-1);
    const [menuAnchorElement, setMenuAnchorElement] = useState<null | HTMLElement>(null);
    const context = useContext(AppContext);

    function onMenuClick(event: React.MouseEvent<HTMLButtonElement>) {
        setMenuAnchorElement(event.currentTarget);
    }

    function onMenuClose() {
        setMenuAnchorElement(null);
    }

    useEffect(() => {
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

    return (
        <SectionLayout>
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
                    <MenuItem onClick={onMenuClose}>Отправить на email</MenuItem>
                </Menu>
            </SectionTitle>

            <Grid
                css={theme => ({
                    maxWidth: theme.maxTemplateWidth,
                    margin: theme.spacing(4),
                    position: "relative",
                })}
            >
                <SelectableBlockWrapper>
                    <Grid css={theme => ({ padding: theme.spacing(4) })}>
                        <Typography css={theme => ({ fontSize: theme.fontSize.xLarge })}>
                            Хардкорное задание для суровых прорабов
                        </Typography>

                        <Grid
                            container
                            spacing={2}
                            justify={"space-between"}
                            css={theme => ({ marginTop: theme.spacing(2) })}
                        >
                            {reportHeaderFields.map((reportHeaderField, reportHeaderKey) => (
                                <Grid item xs={12} md={2} key={reportHeaderKey}>
                                    <Grid
                                        css={theme => ({
                                            color: theme.colors.gray,
                                            fontSize: theme.fontSize.small,
                                            marginBottom: theme.spacing(1),
                                        })}
                                    >
                                        {reportHeaderField.title}
                                    </Grid>
                                    <Grid css={theme => ({ fontSize: theme.fontSize.smaller })}>
                                        {reportHeaderField.text}
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </SelectableBlockWrapper>

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
                {[1, 2, 3, 4, 5].map(item => {
                    const isChecked = item % 2 === 0;
                    const isFocused = focusedBlockId === item;
                    const isLast = item === 5;
                    return (
                        <SelectableBlockWrapper
                            key={item}
                            css={theme => ({
                                padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
                                "&:hover": {
                                    background: theme.colors.light,
                                    "> div:last-child": { background: theme.colors.light },
                                },
                                zIndex: isFocused ? 1300 : "initial",
                            })}
                            focused={isFocused}
                            onMouseDown={() => setFocusedBlockId(item)}
                            onFocus={() => setFocusedBlockId(item)}
                        >
                            <Grid
                                container
                                spacing={2}
                                css={css`
                                    position: relative;
                                `}
                            >
                                <Grid item>
                                    <Grid container justify="flex-end">
                                        <div
                                            css={theme => ({
                                                width: theme.spacing(3),
                                                height: theme.spacing(3),
                                                borderRadius: "50%",
                                                border: `2px solid ${theme.colors.primary}`,
                                                zIndex: 2,
                                                color: isChecked ? theme.colors.white : "initial",
                                                position: "relative",
                                                background: isChecked
                                                    ? theme.colors.primary
                                                    : theme.colors.white,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            })}
                                        >
                                            {isChecked && <CheckIcon />}
                                            {!isChecked && (
                                                <div
                                                    css={theme => ({
                                                        fontSize: theme.fontSize.small,
                                                        color: theme.colors.primary,
                                                    })}
                                                >
                                                    {item}
                                                </div>
                                            )}
                                        </div>
                                        {!isLast && (
                                            <div
                                                css={theme => ({
                                                    width: theme.spacing(0.25),
                                                    height: isFocused
                                                        ? `calc(100% - ${theme.spacing(2)})`
                                                        : `calc(100% + ${theme.spacing()})`,
                                                    background: theme.colors.lightGray,
                                                    position: "absolute",
                                                    top: theme.spacing(4),
                                                    left: "20.5px", // TODO: dynamic calculation
                                                    zIndex: 1,
                                                })}
                                            />
                                        )}
                                    </Grid>
                                </Grid>
                                <Grid item xs={7}>
                                    <Typography
                                        component="div"
                                        css={theme => ({
                                            fontSize: theme.fontSize.larger,
                                            marginBottom: theme.spacing(2),
                                        })}
                                    >
                                        Подготовка технического плана (18.05.2019 - 25.05.2019)
                                    </Typography>
                                    <div
                                        css={theme => ({
                                            color: theme.colors.gray,
                                            fontSize: theme.fontSize.sNormal,
                                        })}
                                    >
                                        <b
                                            css={() => ({
                                                fontWeight: 500,
                                            })}
                                        >
                                            Исполнитель:
                                        </b>{" "}
                                        Рукастый Иннокентий Петрович
                                    </div>

                                    <TableWrapper columns={columns} data={reports} />
                                </Grid>
                            </Grid>
                        </SelectableBlockWrapper>
                    );
                })}
            </Grid>
        </SectionLayout>
    );
};
