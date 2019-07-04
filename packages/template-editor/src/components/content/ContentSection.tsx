/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { ITemplate, TChangeEvent } from "entities";
import { InputField, SelectField } from "@magnit/components";
import { Grid, MenuItem } from "@material-ui/core";
import { ETemplateType } from "entities";
import { useEffect, useState } from "react";

interface IContentSectionProps {
    template: ITemplate;
    focused: boolean;

    onTemplateChange(template: ITemplate): void;
}

export const ContentSection: React.FC<IContentSectionProps> = ({ template, focused, ...props }) => {
    const [templateType, setTemplateType] = useState(ETemplateType.LIGHT);

    function onTemplateTypeChange(event: TChangeEvent) {
        setTemplateType(event.target.value as ETemplateType);
    }

    useEffect(() => {
        props.onTemplateChange({ ...template, type: templateType });
    }, [templateType]);

    return (
        <Grid container direction="column">
            <Grid item xs={12}>
                <Grid container css={theme => ({ paddingRight: theme.spacing(4) })}>
                    <Grid
                        item
                        xs={10}
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
                    <Grid item xs={2}>
                        <SelectField value={templateType} fullWidth onChange={onTemplateTypeChange}>
                            <MenuItem value={ETemplateType.LIGHT}>Простой</MenuItem>
                            <MenuItem value={ETemplateType.COMPLEX}>Сложный</MenuItem>
                        </SelectField>
                    </Grid>
                </Grid>
            </Grid>
            <Grid
                item
                xs={12}
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
            <Grid item xs={12}>
                {props.children}
            </Grid>
        </Grid>
    );
};
