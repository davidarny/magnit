/** @jsx jsx */

import { jsx } from "@emotion/core";
import { InputField } from "@magnit/components";
import { IFocusedPuzzleProps } from "@magnit/entities";
import { Checkbox, Grid, IconButton, Typography } from "@material-ui/core";
import { Close as DeleteIcon } from "@material-ui/icons";
import * as React from "react";
import { useCallback, useState } from "react";

interface ICheckboxAnswerPuzzleProps extends IFocusedPuzzleProps {
    // flag indication this checkbox should render
    // button which adds new checkbox when clicked
    addCheckboxButton: boolean;

    onAddCheckboxButton(id: string): void;

    onDeleteCheckboxButton(id: string): void;
}

export const CheckboxAnswer: React.FC<ICheckboxAnswerPuzzleProps> = props => {
    const {
        puzzle,
        focused,
        index,
        addCheckboxButton,
        onTemplateChange,
        onAddCheckboxButton,
        onDeleteCheckboxButton,
    } = props;

    const [label, setLabel] = useState(puzzle.title || `Вариант ${index + 1}`);

    const onAddCheckboxButtonCallback = useCallback(() => {
        onAddCheckboxButton(puzzle.id);
    }, [onAddCheckboxButton, puzzle.id]);

    const onDeleteCheckboxButtonCallback = useCallback(() => {
        onDeleteCheckboxButton(puzzle.id);
    }, [onDeleteCheckboxButton, puzzle.id]);

    function onLabelChange(event: React.ChangeEvent<HTMLInputElement>) {
        setLabel(event.target.value);
    }

    const onLabelBlur = useCallback(() => {
        puzzle.title = label;
        if (onTemplateChange) {
            onTemplateChange();
        }
    }, [label, onTemplateChange, puzzle.title]);

    if (!focused) {
        return (
            <Grid
                container
                alignItems="center"
                css={theme => ({ marginTop: `${theme.spacing()} !important` })}
            >
                <Grid item>
                    <Checkbox disabled css={theme => ({ marginLeft: `-${theme.spacing()}` })} />
                </Grid>
                <Grid item>
                    <Typography
                        css={theme => ({ color: !label ? theme.colors.gray : "initial" })}
                        variant="body1"
                    >
                        {label || `Вариант ${index + 1}`}
                    </Typography>
                </Grid>
            </Grid>
        );
    }

    return (
        <React.Fragment>
            <Grid
                container
                alignItems="center"
                spacing={2}
                css={theme => ({ marginTop: `${theme.spacing(-1)} !important` })}
            >
                <Grid item>
                    <Checkbox disabled css={theme => ({ marginLeft: `-${theme.spacing()}` })} />
                </Grid>
                <Grid item xs css={{ paddingLeft: "0 !important" }}>
                    <InputField
                        fullWidth
                        value={label}
                        onChange={onLabelChange}
                        onBlur={onLabelBlur}
                    />
                </Grid>
                <Grid item css={theme => ({ padding: `${theme.spacing(0.25)} !important` })}>
                    <IconButton onClick={onDeleteCheckboxButtonCallback}>
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>
            {addCheckboxButton && focused && (
                <Grid
                    container
                    alignItems="flex-end"
                    spacing={2}
                    css={theme => ({ marginBottom: `${theme.spacing()} !important` })}
                >
                    <Grid item>
                        <Checkbox disabled css={theme => ({ marginLeft: `-${theme.spacing()}` })} />
                    </Grid>
                    <Grid
                        item
                        xs
                        css={theme => ({
                            paddingTop: "0 !important",
                            paddingLeft: "0 !important",
                            paddingBottom: theme.spacing(0.5),
                        })}
                    >
                        <InputField
                            fullWidth
                            placeholder="Добавить вариант"
                            onFocus={onAddCheckboxButtonCallback}
                        />
                    </Grid>
                    <Grid
                        item
                        css={theme => ({
                            padding: `${theme.spacing(0.25)} !important`,
                            visibility: "hidden",
                        })}
                    >
                        <IconButton onClick={onDeleteCheckboxButtonCallback}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            )}
        </React.Fragment>
    );
};
