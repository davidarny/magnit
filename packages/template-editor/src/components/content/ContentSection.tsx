/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { ITemplate } from "entities";
import { InputField } from "@magnit/components";
import { Grid } from "@material-ui/core";

interface IContentSectionProps {
    template: ITemplate;
    focused: boolean;
}

export const ContentSection: React.FC<IContentSectionProps> = ({ children, template, focused }) => {
    return (
        <Grid container direction="column">
            <Grid
                item
                css={theme => ({
                    paddingLeft: theme.spacing(4),
                    paddingRight: theme.spacing(4),
                })}
            >
                <InputField
                    fullWidth={true}
                    placeholder="Название шаблона"
                    defaultValue={template.title}
                    isSimpleMode={!focused}
                    InputProps={{
                        style: {
                            fontSize: 26,
                            fontWeight: 500,
                        },
                    }}
                />
            </Grid>
            <Grid
                item
                css={theme => ({
                    paddingLeft: theme.spacing(4),
                    paddingRight: theme.spacing(4),
                    paddingBottom: theme.spacing(4),
                    paddingTop: theme.spacing(2),
                })}
            >
                <InputField
                    fullWidth={true}
                    placeholder="Описание шаблона (необязательно)"
                    defaultValue={template.description}
                    isSimpleMode={!focused}
                    InputProps={{
                        style: {
                            fontSize: 18,
                            fontWeight: 300,
                        },
                    }}
                />
            </Grid>
            <Grid item>{children}</Grid>
        </Grid>
    );
};
