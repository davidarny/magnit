/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Checkbox, InputField } from "@magnit/components";
import { ETemplateType, ITemplate } from "@magnit/entities";
import { FormControl, FormControlLabel, Grid } from "@material-ui/core";
import * as React from "react";
import { useCallback, useState } from "react";

interface IContentSectionProps {
    template: ITemplate;
    focused: boolean;

    onTemplateChange(template: ITemplate): void;
}

type TSelectChangeEvent = React.ChangeEvent<{
    name?: string;
    value: unknown;
}>;

export const SectionHead: React.FC<IContentSectionProps> = props => {
    const { template, focused, onTemplateChange } = props;

    const [templateTitle, setTemplateTitle] = useState(template.title);
    const [templateDescription, setTemplateDescription] = useState(template.description);

    const onTemplateTypeChangeCallback = useCallback(
        (event: TSelectChangeEvent, checked: boolean) => {
            if (checked) {
                onTemplateChange({ ...template, type: ETemplateType.COMPLEX });
            } else {
                onTemplateChange({ ...template, type: ETemplateType.LIGHT });
            }
        },
        [onTemplateChange, template],
    );

    function onTemplateTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setTemplateTitle(event.target.value);
    }

    const onTemplateTitleBlurCallback = useCallback(() => {
        onTemplateChange({ ...template, title: templateTitle });
    }, [onTemplateChange, template, templateTitle]);

    function onTemplateDescriptionChange(event: React.ChangeEvent<HTMLInputElement>) {
        setTemplateDescription(event.target.value);
    }

    const onTemplateDescriptionBlurCallback = useCallback(() => {
        onTemplateChange({ ...template, description: templateDescription });
    }, [onTemplateChange, template, templateDescription]);

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
                            onBlur={onTemplateTitleBlurCallback}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Grid container justify="center" alignItems="flex-end">
                            <FormControl>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={template.type === ETemplateType.COMPLEX}
                                            css={theme => ({ marginRight: theme.spacing() })}
                                            onChange={onTemplateTypeChangeCallback}
                                        />
                                    }
                                    label="Нужна смета"
                                />
                            </FormControl>
                        </Grid>
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
                    onBlur={onTemplateDescriptionBlurCallback}
                />
            </Grid>
            <Grid item xs={12}>
                {props.children}
            </Grid>
        </Grid>
    );
};
