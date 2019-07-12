/** @jsx jsx */

import * as React from "react";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { Grid } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { CustomButton } from "@magnit/components";
import { CheckIcon } from "@magnit/icons";
import { TaskEditor } from "@magnit/task-editor";

export const CreateTask: React.FC = () => {
    return (
        <SectionLayout>
            <SectionTitle title="Создание задания">
                <Grid item>
                    <CustomButton
                        variant="contained"
                        title="Сохранить"
                        scheme="green"
                        icon={<CheckIcon />}
                        css={theme => ({ margin: `0 ${theme.spacing(1)}` })}
                    />
                    <CustomButton
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
                <TaskEditor />
            </Grid>
        </SectionLayout>
    );
};
