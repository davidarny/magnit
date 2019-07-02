/* eslint-disable react-hooks/exhaustive-deps */
/** @jsx jsx */

import * as React from "react";
import { useEffect, useState } from "react";
import { Grid, IconButton, Typography } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { IFocusedPuzzleProps, IPuzzle, ITemplate } from "entities";
import { traverse } from "services/json";
import { Close as DeleteIcon } from "@material-ui/icons";
import { InputField } from "components/fields";

type TChangeEvent = React.ChangeEvent<{ name?: string; value: unknown }>;

interface IDropdownAnswerPuzzleProps extends IFocusedPuzzleProps {
    title: string;
    template: ITemplate;
    // flag indication this dropdown should render
    // button which adds new dropdown when clicked
    addDropdownButton: boolean;

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

    if (!props.questionFocused) {
        return (
            <Grid container direction="column" css={theme => ({ paddingLeft: theme.spacing(2) })}>
                <Grid item>
                    <Typography variant="body1">
                        <Typography
                            component="span"
                            css={theme => ({
                                paddingRight: theme.spacing(),
                            })}
                        >
                            {props.index + 1}.
                        </Typography>
                        {label}
                    </Typography>
                </Grid>
            </Grid>
        );
    }

    return (
        <React.Fragment>
            <Grid container alignItems="flex-end" spacing={2}>
                <Grid item>
                    <Typography
                        css={theme => ({
                            fontSize: theme.fontSize.medium,
                            marginBottom: theme.spacing(0.25),
                        })}
                    >
                        {props.index + 1}.
                    </Typography>
                </Grid>
                <Grid item xs>
                    <InputField fullWidth value={label} onChange={onLabelChange} />
                </Grid>
                <Grid item css={theme => ({ padding: `${theme.spacing(0.25)} !important` })}>
                    <IconButton onClick={onDeleteDropdownButton}>
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>

            {props.addDropdownButton && props.questionFocused && (
                <Grid container alignItems="flex-end" spacing={2}>
                    <Grid item>
                        <Typography
                            css={theme => ({
                                fontSize: theme.fontSize.medium,
                                marginBottom: theme.spacing(0.25),
                            })}
                        >
                            {props.index + 2}.
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs
                        css={theme => ({
                            paddingTop: "0 !important",
                            paddingRight: theme.spacing(4),
                        })}
                    >
                        <InputField
                            fullWidth
                            placeholder={"Добавить вариант"}
                            onClick={onAddDropdownButton}
                        />
                    </Grid>
                    <Grid item />
                </Grid>
            )}
        </React.Fragment>
    );
};
