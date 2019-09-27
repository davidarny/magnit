/** @jsx jsx */

import { jsx } from "@emotion/core";
import { InputField } from "@magnit/components";
import { IFocusedPuzzleProps } from "@magnit/entities";
import { Checkbox, Grid, IconButton, Typography } from "@material-ui/core";
import { Close as DeleteIcon } from "@material-ui/icons";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

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

    const [label, setLabel] = useState(puzzle.title);

    const prevTitle = useRef(label);
    useEffect(() => {
        if (!puzzle.title && (!prevTitle.current || prevTitle.current !== label)) {
            const nextTitle = puzzle.title || `Вариант ${index + 1}`;
            setLabel(nextTitle);
            prevTitle.current = nextTitle;
            puzzle.title = nextTitle;
            if (onTemplateChange) {
                onTemplateChange();
            }
        }
    }, [index, label, onTemplateChange, puzzle.title]);

    const onAddCheckboxButtonCallback = useCallback(() => {
        onAddCheckboxButton(puzzle.id);
    }, [onAddCheckboxButton, puzzle.id]);

    const onDeleteCheckboxButtonCallback = useCallback(() => {
        onDeleteCheckboxButton(puzzle.id);
    }, [onDeleteCheckboxButton, puzzle.id]);

    function onLabelChange(event: React.ChangeEvent<HTMLInputElement>) {
        setLabel(event.target.value);
    }

    const onLabelBlurCallback = useCallback(() => {
        puzzle.title = label;
        if (onTemplateChange) {
            onTemplateChange();
        }
    }, [label, onTemplateChange, puzzle.title]);

    const prevLabel = useRef(label);
    useEffect(() => {
        if (!focused && prevLabel.current !== label) {
            prevLabel.current = label;
            onLabelBlurCallback();
        }
    }, [focused, label, onLabelBlurCallback]);

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
                        onBlur={onLabelBlurCallback}
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
