/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { Grid, Typography } from "@material-ui/core";
import { SectionTitle } from "components/section-title";
import { SectionLayout } from "components/section-layout";
import { CenteredSectionItem } from "components/centered-section-item";
import { Link } from "@reach/router";
import { CustomButton } from "@magnit/components";
import { AddIcon } from "@magnit/icons";

export const Templates: React.FC = () => {
    return (
        <SectionLayout>
            <SectionTitle title="Список шаблонов"/>
            <CenteredSectionItem>
                <Grid container justify="center" alignContent="center" direction="column">
                    <Grid item css={theme => ({ marginBottom: theme.spacing(3) })}>
                        <Typography variant="h4" component="div" align="center">
                            <span>Шаблонов нет</span>
                        </Typography>
                    </Grid>
                    <Grid item css={theme => ({ marginBottom: theme.spacing(3) })}>
                        <Typography variant="subtitle1" component="div" align="center">
                            <span>Для создания шаблона нажмите кнопку</span>
                        </Typography>
                        <Typography variant="subtitle1" component="div" align="center">
                            <span>Создать шаблон</span>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Grid container justify="center" alignContent="center">
                            <Grid item>
                                <CustomButton
                                    component={Link}
                                    to="/templates/create"
                                    icon={<AddIcon/>}
                                    title={"Создать шаблон"}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CenteredSectionItem>
        </SectionLayout>
    );
};
