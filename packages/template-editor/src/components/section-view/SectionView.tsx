/* eslint-disable react-hooks/exhaustive-deps */
/** @jsx jsx */

import { jsx } from "@emotion/core";
import { InputField } from "@magnit/components";
import { ISpecificPuzzleProps, ITemplate } from "@magnit/entities";
import { Grid, Typography } from "@material-ui/core";
import * as React from "react";
import { useEffect, useState } from "react";

interface ISectionPuzzleProps extends ISpecificPuzzleProps {
    id: string;
    title: string;
    focused: boolean;
    template: ITemplate;

    onTemplateChange(template: ITemplate): void;
}

export const SectionView: React.FC<ISectionPuzzleProps> = props => {
    const { id, title, index, focused, children, ...rest } = props;
    const [sectionTitle, setSectionTitle] = useState<string>(title);

    function onSectionTitleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setSectionTitle(event.target.value);
    }

    useEffect(() => {
        rest.onTemplateChange({
            ...rest.template,
            sections: rest.template.sections.map(section => {
                if (section.id === id) {
                    return {
                        ...section,
                        title: sectionTitle,
                    };
                }
                return section;
            }),
        });
    }, [sectionTitle]);

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
                <Grid item xs css={theme => ({ marginLeft: `${theme.spacing(16)} !important` })}>
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
                            onChange={onSectionTitleChange}
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
