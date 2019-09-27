/** @jsx jsx */

import { jsx } from "@emotion/core";
import { InputField } from "@magnit/components";
import { IFocusedPuzzleProps, ISection } from "@magnit/entities";
import { Grid, Typography } from "@material-ui/core";
import * as React from "react";
import { useCallback, useState } from "react";

interface ISectionPuzzleProps extends Omit<IFocusedPuzzleProps, "puzzle"> {
    puzzle: ISection;
}

export const SectionView: React.FC<ISectionPuzzleProps> = props => {
    const { puzzle, index, focused, children, onTemplateChange } = props;

    const [title, setTitle] = useState(puzzle.title);
    const [description, setDescription] = useState(puzzle.description);

    function onSectionTitleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setTitle(event.target.value);
    }

    const onSectionTitleBlurCallback = useCallback(() => {
        puzzle.title = title;
        if (onTemplateChange) {
            onTemplateChange();
        }
    }, [onTemplateChange, puzzle.title, title]);

    function onSectionDescriptionChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setDescription(event.target.value);
    }

    const onSectionDescriptionBlurCallback = useCallback(() => {
        puzzle.description = description;
        if (onTemplateChange) {
            onTemplateChange();
        }
    }, [onTemplateChange, puzzle.description, description]);

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
                            value={title}
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
