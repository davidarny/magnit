/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { Grid } from "@material-ui/core";
import { SectionTitle } from "components/section-title";
import { SectionLayout } from "components/section-layout";
import { Button } from "@magnit/components";
import { SendIcon } from "@magnit/icons";
import { TaskEditor } from "@magnit/task-editor";

export const ViewTask: React.FC = () => {
    return (
        <SectionLayout>
            <SectionTitle title="Информация о задании">
                <Grid item>
                    <Button
                        variant="contained"
                        title="Отправить"
                        scheme="blue"
                        icon={<SendIcon />}
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
                <TaskEditor templates={[]} variant="view" />
            </Grid>
        </SectionLayout>
    );
};
