/** @jsx jsx */

import * as React from "react";
import { useEffect, useState } from "react";
import { Button, Grid, IconButton, Radio, TextField } from "@material-ui/core";
import { css, jsx } from "@emotion/core";
import { IFocusedPuzzleProps, IPuzzle, ITemplate } from "entities";
import { traverse } from "services/json";
import { Close as DeleteIcon } from "@material-ui/icons";

type TChangeEvent = React.ChangeEvent<{ name?: string; value: unknown }>;

interface IRadioAnswerPuzzleProps extends IFocusedPuzzleProps {
    title: string;
    template: ITemplate;
    // flag indication this radio should render
    // button which adds new radio when clicked
    addRadioButton: boolean;

    onTemplateChange(template: ITemplate): void;

    onAddRadioButton(id: string): void;

    onDeleteRadioButton(id: string): void;
}

export const RadioAnswerPuzzle: React.FC<IRadioAnswerPuzzleProps> = ({ template, ...props }) => {
    const [label, setLabel] = useState(props.title || `Вариант ${props.index + 1}`);

    useEffect(() => {
        traverse(template, (value: any) => {
            if (typeof value !== "object" || !("puzzles" in value)) {
                return;
            }
            const puzzle = value as IPuzzle;
            if (!("id" in puzzle) || puzzle.id !== props.id) {
                return;
            }
            puzzle.title = label;
        });
        props.onTemplateChange({ ...template });
    }, [label]);

    function onLabelChange(event: TChangeEvent): void {
        setLabel(event.target.value as string);
    }

    function onAddRadioButton(): void {
        props.onAddRadioButton(props.id);
    }

    function onDeleteRadioButton(): void {
        props.onDeleteRadioButton(props.id);
    }

    return (
        <React.Fragment>
            <Grid container alignItems="center">
                <Grid item xs={1}>
                    <Radio
                        disabled
                        css={{
                            paddingLeft: 0,
                        }}
                    />
                </Grid>
                <Grid item xs={10}>
                    <TextField fullWidth value={label} onChange={onLabelChange} />
                </Grid>
                <Grid item xs={1}>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <IconButton onClick={onDeleteRadioButton}>
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {props.addRadioButton && props.questionFocused && (
                <Grid container alignItems="center">
                    <Grid item xs={1} css={theme => ({ marginTop: theme.spacing(2) })}>
                        <Radio
                            disabled
                            css={{
                                paddingLeft: 0,
                            }}
                        />
                    </Grid>
                    <Grid item xs={11} css={theme => ({ marginTop: theme.spacing(2) })}>
                        <Button
                            variant="contained"
                            size="small"
                            css={css`
                                text-transform: none;
                            `}
                            onClick={onAddRadioButton}
                        >
                            Добавить вариант
                        </Button>
                    </Grid>
                </Grid>
            )}
        </React.Fragment>
    );
};
