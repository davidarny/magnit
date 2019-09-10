/** @jsx jsx */

import { jsx } from "@emotion/core";
import { InputField } from "@magnit/components";
import { ISpecificPuzzleProps, ITemplate } from "@magnit/entities";
import { Grid, Typography } from "@material-ui/core";
import * as React from "react";
import { useCallback, useState } from "react";

interface ISectionPuzzleProps extends ISpecificPuzzleProps {
    id: string;
    title: string;
    description: string;
    focused: boolean;
    template: ITemplate;

    onTemplateChange(template: ITemplate): void;
}

export const SectionView: React.FC<ISectionPuzzleProps> = props => {
    const { id, title, index, focused, children, description, template } = props;
    const { onTemplateChange } = props;
    const [sectionTitle, setSectionTitle] = useState(title);
    const [sectionDescription, setSectionDescription] = useState(description);

    function onSectionTitleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setSectionTitle(event.target.value);
    }

    const onSectionTitleBlurCallback = useCallback(() => {
        onTemplateChange({
            ...template,
            sections: template.sections.map(section => {
                if (section.id === id) {
                    return {
                        ...section,
                        title: sectionTitle,
                    };
                }
                return section;
            }),
        });
    }, [id, onTemplateChange, sectionTitle, template]);

    function onSectionDescriptionChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setSectionDescription(event.target.value);
    }

    const onSectionDescriptionBlurCallback = useCallback(() => {
        onTemplateChange({
            ...template,
            sections: template.sections.map(section => {
                if (section.id === id) {
                    return {
                        ...section,
                        description: sectionDescription,
                    };
                }
                return section;
            }),
        });
    }, [id, onTemplateChange, sectionDescription, template]);

    return (
        <React.Fragment>
            <Grid
                container
                alignItems="flex-end"
                justify="center"
                spacing={2}
                css={theme => ({
                    paddingLeft: theme.spacing(4),
                    paddingRight: theme.spacing(4),
                    paddingBottom: theme.spacing(2),
                    position: "relative",
                })}
            >
                <Grid
                    item
                    css={theme => ({
                        position: "absolute",
                        top: theme.spacing(),
                        left: theme.spacing(4),
                    })}
                >
                    <Typography css={theme => ({ fontSize: theme.fontSize.large })}>
                        Раздел {index + 1}.
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={12}
                    css={theme => ({ marginLeft: `${theme.spacing(16)} !important` })}
                >
                    <Grid item>
                        <InputField
                            fullWidth={true}
                            placeholder="Название раздела"
                            defaultValue={title}
                            simple={!focused}
                            css={theme => ({
                                input: {
                                    fontSize: theme.fontSize.xLarge,
                                    fontWeight: 500,
                                },
                            })}
                            onBlur={onSectionTitleBlurCallback}
                            onChange={onSectionTitleChange}
                        />
                    </Grid>
                </Grid>
                <Grid
                    item
                    xs={12}
                    css={theme => ({ marginLeft: `${theme.spacing(16)} !important` })}
                >
                    <Grid item>
                        <InputField
                            fullWidth={true}
                            placeholder="Описание (необязательно)"
                            defaultValue={description}
                            simple={!focused}
                            css={theme => ({
                                input: {
                                    fontSize: theme.fontSize.medium,
                                    fontWeight: 500,
                                },
                            })}
                            onBlur={onSectionDescriptionBlurCallback}
                            onChange={onSectionDescriptionChange}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid container direction="column">
                {children}
            </Grid>
        </React.Fragment>
    );
};
