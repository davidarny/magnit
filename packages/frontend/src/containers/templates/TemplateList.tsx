/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { SectionTitle } from "components/section-title";
import { SectionLayout } from "components/section-layout";
import { Link, Redirect } from "@reach/router";
import { Button, IColumn, InputField, TableWrapper } from "@magnit/components";
import { AddIcon } from "@magnit/icons";
import { EmptyList } from "components/list";
import { getTemplates } from "services/api/templates";
import { AppContext } from "context";
import { Grid, Paper } from "@material-ui/core";
import _ from "lodash";
import { getFriendlyDate } from "@magnit/services";

const columns: IColumn[] = [
    { key: "title", sortable: true, label: "Название шаблона" },
    { key: "description", label: "Описание" },
    { key: "createdAt", label: "Дата создания" },
    { key: "updatedAt", label: "Дата редактирования" },
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
                        createdAt: getFriendlyDate(new Date(template.createdAt)),
                        updatedAt: getFriendlyDate(new Date(template.updatedAt)),
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
                    <Button
                        component={Link}
                        to="create"
                        variant="contained"
                        title="Создать шаблон"
                        scheme="blue"
                        icon={<AddIcon />}
                        css={css`
                            width: 180px;
                        `}
                    />
                </Grid>
            </SectionTitle>
            {empty && (
                <EmptyList
                    title={"Шаблонов нет"}
                    actionName={"Создать шаблон"}
                    button={
                        <Button
                            component={Link}
                            to="create"
                            icon={<AddIcon />}
                            title={"Создать шаблон"}
                            css={css`
                                width: 180px;
                            `}
                        />
                    }
                    description={"Для создания шаблона нажмите кнопку"}
                />
            )}
            {!empty && (
                <Paper
                    square={true}
                    css={theme => ({
                        margin: theme.spacing(3),
                        boxShadow: `0px 0px ${theme.spacing(2)} ${
                            theme.colors.lightGray
                        } !important`,
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
