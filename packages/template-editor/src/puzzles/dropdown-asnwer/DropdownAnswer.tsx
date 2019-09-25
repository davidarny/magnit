/** @jsx jsx */

import { jsx } from "@emotion/core";
import { InputField } from "@magnit/components";
import { IFocusedPuzzleProps } from "@magnit/entities";
import { Grid, IconButton, Typography } from "@material-ui/core";
import { Close as DeleteIcon } from "@material-ui/icons";
import * as React from "react";
import { useCallback, useState } from "react";

interface IDropdownAnswerPuzzleProps extends IFocusedPuzzleProps {
    // flag indication this dropdown should render
    // button which adds new dropdown when clicked
    addDropdownButton: boolean;

    onAddDropdownButton(id: string): void;

    onDeleteDropdownButton(id: string): void;
}

export const DropdownAnswer: React.FC<IDropdownAnswerPuzzleProps> = props => {
    const {
        puzzle,
        focused,
        addDropdownButton,
        index,
        onAddDropdownButton,
        onTemplateChange,
        onDeleteDropdownButton,
    } = props;

    const [label, setLabel] = useState(puzzle.title || `Вариант ${index + 1}`);

    const onAddDropdownButtonCallback = useCallback(() => {
        onAddDropdownButton(puzzle.id);
    }, [onAddDropdownButton, puzzle.id]);

    const onDeleteDropdownButtonCallback = useCallback(() => {
        onDeleteDropdownButton(puzzle.id);
    }, [onDeleteDropdownButton, puzzle.id]);

    function onLabelChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setLabel(event.target.value as string);
    }

    const onLabelBlurCallback = useCallback(() => {
        puzzle.title = label;
        if (onTemplateChange) {
            onTemplateChange();
        }
    }, [label, onTemplateChange, puzzle.title]);

    if (!focused) {
        return (
            <Grid
                container
                css={theme => ({
                    paddingLeft: theme.spacing(2),
                    paddingRight: theme.spacing(),
                    margin: `${theme.spacing()} ${theme.spacing()} ${theme.spacing()} !important`,
                })}
            >
                <Grid item>
                    <Typography
                        variant="body1"
                        component="span"
                        css={theme => ({ paddingRight: theme.spacing() })}
                    >
                        {index + 1}.
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography
                        variant="body1"
                        component="span"
                        css={theme => ({ color: !label ? theme.colors.gray : "initial" })}
                    >
                        {label || `Вариант ${index + 1}`}
                    </Typography>
                </Grid>
            </Grid>
        );
    }

    return (
        <React.Fragment>
            <Grid container alignItems="center" spacing={2}>
                <Grid item>
                    <Typography css={theme => ({ fontSize: theme.fontSize.medium })}>
                        {index + 1}.
                    </Typography>
                </Grid>
                <Grid item xs>
                    <InputField
                        fullWidth
                        value={label}
                        onChange={onLabelChange}
                        onBlur={onLabelBlurCallback}
                    />
                </Grid>
                <Grid item>
                    <IconButton onClick={onDeleteDropdownButtonCallback}>
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>

            {addDropdownButton && focused && (
                <Grid
                    container
                    alignItems="flex-end"
                    spacing={2}
                    css={theme => ({ marginTop: theme.spacing(-2) })}
                >
                    <Grid item>
                        <Typography
                            css={theme => ({
                                fontSize: theme.fontSize.medium,
                                position: "relative",
                                top: theme.spacing(-1),
                            })}
                        >
                            {index + 2}.
                        </Typography>
                    </Grid>
                    <Grid item xs>
                        <InputField
                            fullWidth
                            placeholder="Добавить вариант"
                            onFocus={onAddDropdownButtonCallback}
                        />
                    </Grid>
                    <Grid item css={{ visibility: "hidden" }}>
                        <IconButton onClick={onDeleteDropdownButtonCallback}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            )}
        </React.Fragment>
    );
};
