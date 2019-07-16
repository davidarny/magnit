/** @jsx jsx */

import * as React from "react";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { Grid } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { Button } from "@magnit/components";
import { CheckIcon } from "@magnit/icons";
import { TaskEditor } from "@magnit/task-editor";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "context";
import { getTemplate, getTemplates } from "services/api";
import _ from "lodash";

interface IShortTemplate {
    id: string;
    title: string;
}

export const CreateTask: React.FC = () => {
    const context = useContext(AppContext);
    const [templates, setTemplates] = useState<IShortTemplate[]>([]);

    useEffect(() => {
        getTemplates(context.courier)
            .then(response => {
                return response.templates.map(template => ({
                    ...template,
                    id: template.id.toString(),
                }));
            })
            .then(templates => setTemplates(templates))
            .catch(console.error);
    }, [context.courier]);

    return (
        <SectionLayout>
            <SectionTitle title="Создание задания">
                <Grid item>
                    <Button
                        variant="contained"
                        title="Сохранить"
                        scheme="green"
                        icon={<CheckIcon />}
                        css={theme => ({ margin: `0 ${theme.spacing(1)}` })}
                    />
                    <Button
                        variant="contained"
                        title="Отправить"
                        scheme="violet"
                        icon={<CheckIcon />}
                        css={theme => ({ margin: `0 ${theme.spacing(1)}` })}
                    />
                </Grid>
            </SectionTitle>
            <Grid
                css={theme => ({
                    maxWidth: theme.maxTemplateWidth,
                    margin: theme.spacing(4),
                    position: "relative",
                })}
            >
                <TaskEditor
                    templates={templates}
                    getTemplate={(id: string) => getTemplate(context.courier, _.toNumber(id))}
                />
            </Grid>
        </SectionLayout>
    );
};
