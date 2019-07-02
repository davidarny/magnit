/** @jsx jsx */

import * as React from "react";
import { useEffect, useState } from "react";
import { Checkbox, Grid, IconButton, Typography } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { IFocusedPuzzleProps, IPuzzle, ITemplate } from "entities";
import { traverse } from "services/json";
import { Close as DeleteIcon } from "@material-ui/icons";
import { InputField } from "../../components/fields";

type TChangeEvent = React.ChangeEvent<{ name?: string; value: unknown }>;

interface ICheckboxAnswerPuzzleProps extends IFocusedPuzzleProps {
    title: string;
    template: ITemplate;
    // flag indication this checkbox should render
    // button which adds new checkbox when clicked
    addCheckboxButton: boolean;

    onTemplateChange(template: ITemplate): void;

    onAddCheckboxButton(id: string): void;

    onDeleteCheckboxButton(id: string): void;
}

export const CheckboxAnswerPuzzle: React.FC<ICheckboxAnswerPuzzleProps> = ({ ...props }) => {
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

    function onAddCheckboxButton(): void {
        props.onAddCheckboxButton(props.id);
    }

    function onDeleteCheckboxButton(): void {
        props.onDeleteCheckboxButton(props.id);
    }

    if (!props.questionFocused) {
        return (
            <Grid container alignItems="center">
                <Grid item>
                    <Checkbox css={theme => ({ marginLeft: `-${theme.spacing()}` })} />
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
                    <Checkbox
                        disabled
                        css={theme => ({
                            marginLeft: `-${theme.spacing()}`,
                            paddingBottom: theme.spacing(0.5),
                        })}
                    />
                </Grid>
                <Grid item xs style={{ paddingLeft: 0 }}>
                    <InputField fullWidth placeholder={label} onChange={onLabelChange} />
                </Grid>
                <Grid item>
                    <Grid container justify="flex-end">
                        <IconButton onClick={onDeleteCheckboxButton} style={{ padding: 0 }}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
            {props.addCheckboxButton && (
                <Grid container alignItems="flex-end" spacing={2}>
                    <Grid item>
                        <Checkbox
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
                            onChange={onAddCheckboxButton}
                        />
                    </Grid>
                    <Grid item />
                </Grid>
            )}
        </React.Fragment>
    );
};
