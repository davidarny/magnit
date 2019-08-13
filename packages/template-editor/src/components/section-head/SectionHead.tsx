/* eslint-disable react-hooks/exhaustive-deps */
/** @jsx jsx */

import * as React from "react";
import { useEffect, useState } from "react";
import { jsx } from "@emotion/core";
import { ETemplateType, ITemplate, TChangeEvent } from "entities";
import { InputField, SelectField } from "@magnit/components";
import { Grid, MenuItem } from "@material-ui/core";

interface IContentSectionProps {
    template: ITemplate;
    focused: boolean;

    onTemplateChange(template: ITemplate): void;
}

export const SectionHead: React.FC<IContentSectionProps> = ({ template, focused, ...props }) => {
    const [templateType, setTemplateType] = useState(ETemplateType.LIGHT);
    const [templateTitle, setTemplateTitle] = useState(template.title);
    const [templateDescription, setTemplateDescription] = useState(template.description);

    function onTemplateTypeChange(event: TChangeEvent): void {
        setTemplateType(event.target.value as ETemplateType);
    }

    function onTemplateTitleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setTemplateTitle(event.target.value);
    }

    function onTemplateDescriptionChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setTemplateDescription(event.target.value);
    }

    useEffect(() => {
        props.onTemplateChange({
            ...template,
            type: templateType,
            title: templateTitle,
            description: templateDescription,
        });
    }, [templateType, templateTitle, templateDescription]);

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
                            simple={!focused}
                            css={theme => ({
                                input: {
                                    fontSize: theme.fontSize.xLarge,
                                    fontWeight: 500,
                                },
                            })}
                            onChange={onTemplateTitleChange}
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
                    placeholder="Описание (необязательно)"
                    defaultValue={template.description}
                    simple={!focused}
                    css={theme => ({
                        input: {
                            fontSize: theme.fontSize.medium,
                            fontWeight: 500,
                        },
                    })}
                    onChange={onTemplateDescriptionChange}
                />
            </Grid>
            <Grid item xs={12}>
                {props.children}
            </Grid>
        </Grid>
    );
};
