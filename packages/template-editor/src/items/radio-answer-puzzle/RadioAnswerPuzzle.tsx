/* eslint-disable react-hooks/exhaustive-deps */
/** @jsx jsx */

import * as React from "react";
import { useEffect, useState } from "react";
import { Grid, IconButton, Radio, Typography } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { IFocusedPuzzleProps, IPuzzle, ITemplate } from "entities";
import { traverse } from "services/json";
import { Close as DeleteIcon } from "@material-ui/icons";
import { InputField } from "components/fields";

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

    if (!props.questionFocused) {
        return (
            <Grid container alignItems="center">
                <Grid item>
                    <Radio disabled css={theme => ({ marginLeft: `-${theme.spacing()}` })} />
                </Grid>
                <Grid item>
                    <Typography variant="body1">{label}</Typography>
                </Grid>
            </Grid>
        );
    }

    return (
        <React.Fragment>
            <Grid container alignItems="flex-end" spacing={2}>
                <Grid item>
                    <Radio
                        disabled
                        css={theme => ({
                            marginLeft: `-${theme.spacing()}`,
                            paddingBottom: theme.spacing(0.5),
                        })}
                    />
                </Grid>
                <Grid item xs style={{ paddingLeft: 0 }}>
                    <InputField fullWidth value={label} onChange={onLabelChange} />
                </Grid>
                <Grid item css={theme => ({ padding: `${theme.spacing(0.25)} !important` })}>
                    <IconButton onClick={onDeleteRadioButton}>
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>

            {props.addRadioButton && (
                <Grid container alignItems="flex-end" spacing={2}>
                    <Grid item>
                        <Radio
                            disabled
                            css={theme => ({
                                marginLeft: `-${theme.spacing()}`,
                                paddingBottom: theme.spacing(0.5),
                            })}
                        />
                    </Grid>
                    <Grid
                        item
                        xs
                        css={theme => ({
                            paddingTop: "0 !important",
                            paddingLeft: "0 !important",
                            paddingRight: theme.spacing(4),
                        })}
                    >
                        <InputField
                            fullWidth
                            placeholder={"Добавить вариант"}
                            onClick={onAddRadioButton}
                        />
                    </Grid>
                    <Grid item />
                </Grid>
            )}
        </React.Fragment>
    );
};
