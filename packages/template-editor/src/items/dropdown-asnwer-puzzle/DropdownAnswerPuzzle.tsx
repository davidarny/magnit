/** @jsx jsx */

import * as React from "react";
import { useEffect, useState } from "react";
import { Button, Grid, IconButton, TextField } from "@material-ui/core";
import { css, jsx } from "@emotion/core";
import { IPuzzle, ISpecificPuzzleProps, ITemplate } from "entities";
import { traverse } from "services/json";
import { Close as DeleteIcon } from "@material-ui/icons";

type TChangeEvent = React.ChangeEvent<{ name?: string; value: unknown }>;

interface IDropdownAnswerPuzzleProps extends ISpecificPuzzleProps {
    title: string;
    template: ITemplate;
    // flag indication this dropdown should render
    // button which adds new dropdown when clicked
    addDropdownButton: boolean;
    // if not focused, we don't show add button
    questionFocused: boolean;

    onTemplateChange(template: ITemplate): void;

    onAddDropdownButton(id: string): void;

    onDeleteDropdownButton(id: string): void;
}

export const DropdownAnswerPuzzle: React.FC<IDropdownAnswerPuzzleProps> = ({ ...props }) => {
    const [label, setLabel] = useState(props.title || `Вариант ${props.index + 1}`);

    useEffect(() => {
        traverse(props.template, (value: any) => {
            if (typeof value !== "object" || !("puzzles" in value)) {
                return;
            }
            const puzzle = value as IPuzzle;
            if (!("id" in puzzle) || puzzle.id !== props.id) {
                return;
            }
            puzzle.title = label;
        });
        props.onTemplateChange({ ...props.template });
    }, [label]);

    function onLabelChange(event: TChangeEvent): void {
        setLabel(event.target.value as string);
    }

    function onAddDropdownButton(): void {
        props.onAddDropdownButton(props.id);
    }

    function onDeleteDropdownButton(): void {
        props.onDeleteDropdownButton(props.id);
    }

    return (
        <React.Fragment>
            <Grid container alignItems="center">
                <Grid item xs={1}>
                    {props.index + 1}.
                </Grid>
                <Grid item xs={10}>
                    <TextField fullWidth value={label} onChange={onLabelChange} />
                </Grid>
                <Grid item xs={1}>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <IconButton onClick={onDeleteDropdownButton}>
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {props.addDropdownButton && props.questionFocused && (
                <Grid container alignItems="center">
                    <Grid item xs={1} css={theme => ({ marginTop: theme.spacing(2) })}>
                        {props.index + 2}.
                    </Grid>
                    <Grid item xs={11} css={theme => ({ marginTop: theme.spacing(2) })}>
                        <Button
                            variant="contained"
                            size="small"
                            css={css`
                                text-transform: none;
                            `}
                            onClick={onAddDropdownButton}
                        >
                            Добавить вариант
                        </Button>
                    </Grid>
                </Grid>
            )}
        </React.Fragment>
    );
};
