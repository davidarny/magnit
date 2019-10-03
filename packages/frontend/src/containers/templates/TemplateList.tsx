/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Button, IColumn, InputField, ITableDataItem, TableWrapper } from "@magnit/components";
import { AddIcon } from "@magnit/icons";
import { getFriendlyDate } from "@magnit/services";
import { Grid, MenuItem, Paper, Typography } from "@material-ui/core";
import { Link, Redirect } from "@reach/router";
import { EmptyList } from "components/list";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { AppContext } from "context";
import _ from "lodash";
import * as React from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import {
    deleteTemplate,
    getShortTemplates,
    TShortTemplate,
    TShortTemplateSortKeys,
} from "services/api/templates";

const columns: IColumn[] = [
    { key: "title", label: "Название шаблона", sortable: true },
    { key: "description", label: "Описание", sortable: true },
    { key: "createdAt", label: "Дата создания", sortable: true },
    { key: "updatedAt", label: "Дата редактирования", sortable: true },
];

interface IUpdateTemplateListOptions {
    sort?: "asc" | "desc";
    sortBy?: TShortTemplateSortKeys;
    title?: string;
}

export const TemplateList: React.FC = () => {
    const context = useContext(AppContext);

    // full text search
    const [searchQuery, setSearchQuery] = useState("");

    // table
    const [total, setTotal] = useState(0);
    const [rows, setRows] = useState<TShortTemplate[]>([]);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [orderBy, setOrderBy] = useState<TShortTemplateSortKeys>("");

    // redirect to row
    const [redirect, setRedirect] = useState({ redirect: false, to: "" });

    const fetchTemplatesAndSetState = useCallback(
        ({ title, sort, sortBy }: IUpdateTemplateListOptions = {}) => {
            // filtered
            const upperCaseSort = (sort || "ASC").toUpperCase() as "ASC" | "DESC";
            getShortTemplates(context.courier, title, upperCaseSort, sortBy)
                .then(response => {
                    setRows(
                        response.templates.map(template => ({
                            ...template,
                            createdAt: getFriendlyDate(new Date(template.createdAt!), true),
                            updatedAt: getFriendlyDate(new Date(template.updatedAt!), true),
                        })),
                    );
                    setTotal(response.all);
                })
                .catch(console.error);
        },
        [context.courier],
    );

    useEffect(() => {
        // reset table
        setPage(0);
        setOrder("asc");
        setOrderBy("");
        // reset search query
        setSearchQuery("");
        // fetch templates
        fetchTemplatesAndSetState();
    }, [context.courier, fetchTemplatesAndSetState]);

    function onRowClick(row?: ITableDataItem) {
        if (!row) {
            return;
        }
        setRedirect({ redirect: true, to: row.id });
    }

    function onChangePage(nextPage: number) {
        setPage(nextPage);
    }

    const onDeleteTemplateCallback = useCallback(
        (id: number) => {
            deleteTemplate(context.courier, id)
                .then(() => {
                    fetchTemplatesAndSetState();
                    context.setSnackbarState({ open: true, message: "Шаблон успешно удалён" });
                })
                .catch(() => {
                    context.setSnackbarError(true);
                    context.setSnackbarState({ open: true, message: "Не удалось удалить шаблон" });
                });
        },
        [context, fetchTemplatesAndSetState],
    );

    const renderMenuItems = useCallback(
        (row: ITableDataItem, onMenuClose: () => void) => {
            function onDeleteClick(event: React.MouseEvent<HTMLLIElement>) {
                event.stopPropagation();
                onDeleteTemplateCallback(row.id);
                onMenuClose();
            }

            return [
                <MenuItem key={row.id} onClick={onDeleteClick}>
                    Удалить
                </MenuItem>,
            ];
        },
        [onDeleteTemplateCallback],
    );

    const updateTemplateListDebounced = _.debounce(fetchTemplatesAndSetState, 150);

    const onSearchQueryChangeCallback = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            setSearchQuery(value);
            updateTemplateListDebounced({
                title: value,
                sort: order,
                sortBy: orderBy,
            });
        },
        [order, orderBy, updateTemplateListDebounced],
    );

    const onRequestSortCallback = useCallback(
        (sort: "asc" | "desc", sortBy: keyof TShortTemplate) => {
            setOrder(sort);
            setOrderBy(sortBy);
            fetchTemplatesAndSetState({ title: searchQuery, sort, sortBy });
        },
        [fetchTemplatesAndSetState, searchQuery],
    );

    const empty = !total;

    return (
        <SectionLayout>
            {redirect.redirect && <Redirect to={`templates/edit/${redirect.to}`} noThrow />}
            <SectionTitle title="Список шаблонов">
                <Grid item hidden={empty}>
                    <Button component={Link} to="create" variant="contained" scheme="blue">
                        <AddIcon />
                        <Typography>Создать шаблон</Typography>
                    </Button>
                </Grid>
            </SectionTitle>
            {empty && (
                <EmptyList
                    title="Шаблонов нет"
                    button={
                        <Button component={Link} to="create" scheme="blue">
                            <AddIcon />
                            <Typography>Создать шаблон</Typography>
                        </Button>
                    }
                >
                    <div>Для создания шаблона нажмите кнопку</div>
                    <div>Создать шаблон</div>
                </EmptyList>
            )}
            {!empty && (
                <Paper
                    square={true}
                    css={({ colors, spacing }) => ({
                        margin: spacing(3),
                        boxShadow: `0 0 ${spacing(2)} ${colors.lightGray} !important`,
                    })}
                >
                    <Grid
                        container
                        direction="row"
                        css={theme => ({ marginTop: theme.spacing(2) })}
                    >
                        <Grid
                            container
                            direction="column"
                            css={theme => ({ padding: theme.spacing(3) })}
                        >
                            <Grid container direction="row" spacing={2}>
                                <Grid
                                    item
                                    xs
                                    css={theme => ({ padding: `0 ${theme.spacing(6)} !important` })}
                                >
                                    <InputField
                                        value={searchQuery}
                                        placeholder="Поиск ..."
                                        fullWidth
                                        onChange={onSearchQueryChangeCallback}
                                        css={({ colors, radius, spacing }) => ({
                                            borderRadius: radius(5),
                                            background: colors.white,
                                            border: `1px solid ${colors.lightGray}`,
                                            transition: "border 0.25s ease-in-out",
                                            cursor: "pointer",
                                            ":hover, :active": {
                                                border: `1px solid ${colors.primary}`,
                                            },
                                            div: {
                                                ":before, :after": { border: "none !important" },
                                            },
                                            input: { padding: `${spacing(2)} ${spacing(4)}` },
                                        })}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item css={theme => ({ padding: theme.spacing(3) })}>
                                <TableWrapper
                                    page={page}
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={onRequestSortCallback}
                                    columns={columns}
                                    renderMenuItems={renderMenuItems}
                                    data={rows}
                                    onRowClick={onRowClick}
                                    onChangePage={onChangePage}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </SectionLayout>
    );
};
