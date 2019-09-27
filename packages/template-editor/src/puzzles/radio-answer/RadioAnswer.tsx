/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import { InputField } from "@magnit/components";
import { IFocusedPuzzleProps } from "@magnit/entities";
import { Grid, IconButton, Radio, Typography } from "@material-ui/core";
import { Close as DeleteIcon } from "@material-ui/icons";
import { useEffect, useRef } from "react";
import * as React from "react";
import { useCallback, useState } from "react";

interface IRadioAnswerPuzzleProps extends IFocusedPuzzleProps {
    // flag indication this radio should render
    // button which adds new radio when clicked
    addRadioButton: boolean;

    onAddRadioButton(id: string): void;

    onDeleteRadioButton(id: string): void;
}

export const RadioAnswer: React.FC<IRadioAnswerPuzzleProps> = props => {
    const {
        puzzle,
        addRadioButton,
        index,
        focused,
        onTemplateChange,
        onAddRadioButton,
        onDeleteRadioButton,
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

    const onAddRadioButtonCallback = useCallback(() => {
        onAddRadioButton(puzzle.id);
    }, [puzzle.id, onAddRadioButton]);

    const onDeleteRadioButtonCallback = useCallback(() => {
        onDeleteRadioButton(puzzle.id);
    }, [onDeleteRadioButton, puzzle.id]);

    function onLabelChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setLabel(event.target.value as string);
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
                    <Radio disabled css={theme => ({ marginLeft: `-${theme.spacing()}` })} />
                </Grid>
                <Grid item>
                    <Typography
                        variant="body1"
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
            <Grid
                container
                alignItems="center"
                spacing={2}
                css={theme => ({ marginTop: `${theme.spacing(-1)} !important` })}
            >
                <Grid item>
                    <Radio disabled css={theme => ({ marginLeft: `-${theme.spacing()}` })} />
                </Grid>
                <Grid
                    item
                    xs
                    css={css`
                        padding-left: 0 !important;
                    `}
                >
                    <InputField
                        fullWidth
                        value={label}
                        onChange={onLabelChange}
                        onBlur={onLabelBlurCallback}
                    />
                </Grid>
                <Grid item css={theme => ({ padding: `${theme.spacing(0.25)} !important` })}>
                    <IconButton onClick={onDeleteRadioButtonCallback}>
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>

            {addRadioButton && focused && (
                <Grid
                    container
                    alignItems="flex-end"
                    spacing={2}
                    css={theme => ({ marginBottom: `${theme.spacing()} !important` })}
                >
                    <Grid item>
                        <Radio disabled css={theme => ({ marginLeft: `-${theme.spacing()}` })} />
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
                            onFocus={onAddRadioButtonCallback}
                        />
                    </Grid>
                    <Grid
                        item
                        css={theme => ({
                            padding: `${theme.spacing(0.25)} !important`,
                            visibility: "hidden",
                        })}
                    >
                        <IconButton onClick={onDeleteRadioButtonCallback}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            )}
        </React.Fragment>
    );
};
