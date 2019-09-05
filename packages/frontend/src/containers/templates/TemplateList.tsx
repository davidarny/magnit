/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Button, IColumn, InputField, TableWrapper } from "@magnit/components";
import { AddIcon } from "@magnit/icons";
import { getFriendlyDate } from "@magnit/services";
import { Grid, Paper, Typography } from "@material-ui/core";
import { Link, Redirect } from "@reach/router";
import { EmptyList } from "components/list";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { AppContext } from "context";
import _ from "lodash";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { getTemplates } from "services/api/templates";

const columns: IColumn[] = [
    { key: "title", label: "Название шаблона", sortable: true },
    { key: "description", label: "Описание", sortable: true },
    { key: "createdAt", label: "Дата создания", sortable: true },
    { key: "updatedAt", label: "Дата редактирования", sortable: true },
];

export const TemplateList: React.FC = () => {
    const context = useContext(AppContext);
    const [rows, setRows] = useState<object[]>([]);
    const [redirect, setRedirect] = useState({ redirect: false, to: "" });

    useEffect(() => {
        getTemplates(context.courier)
            .then(response => {
                response.templates = response.templates.map(template => {
                    return {
                        ...template,
                        createdAt: getFriendlyDate(new Date(template.createdAt!), true),
                        updatedAt: getFriendlyDate(new Date(template.updatedAt!), true),
                    };
                });
                setRows(response.templates);
            })
            .catch(console.error);
    }, [context.courier]);

    function onRowClick(row?: object) {
        if (!_.isObject(row) || !_.has(row, "id")) {
            return;
        }
        setRedirect({ redirect: true, to: _.get(row, "id") });
    }

    const empty = !rows.length;

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
                    css={theme => ({
                        margin: theme.spacing(3),
                        boxShadow: `0 0 ${theme.spacing(2)} ${theme.colors.lightGray} !important`,
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
                                <Grid item xs>
                                    <InputField
                                        placeholder="Поиск ..."
                                        fullWidth
                                        css={theme => ({
                                            borderRadius: theme.radius(5),
                                            background: theme.colors.white,
                                            border: `1px solid ${theme.colors.lightGray}`,
                                            transition: "border 0.25s ease-in-out",
                                            cursor: "pointer",
                                            ":hover, :active": {
                                                border: `1px solid ${theme.colors.primary}`,
                                            },
                                            div: {
                                                ":before, :after": {
                                                    border: "none !important",
                                                },
                                            },
                                            input: {
                                                padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                                            },
                                        })}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item css={theme => ({ padding: theme.spacing(3) })}>
                                <TableWrapper
                                    columns={columns}
                                    data={rows}
                                    onRowClick={onRowClick}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </SectionLayout>
    );
};
