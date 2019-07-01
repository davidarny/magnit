/** @jsx jsx */

import * as React from "react";
import { useEffect, useState } from "react";
import { Grid, IconButton, Typography } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { IFocusedPuzzleProps, IPuzzle, ITemplate } from "entities";
import { traverse } from "services/json";
import { Close as DeleteIcon } from "@material-ui/icons";
import { InputField } from "../../components/fields";

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
            <Grid
                container
                direction="column"
                css={theme => ({
                    paddingLeft: theme.spacing(2),
                    marginLeft: "8px !important",
                    marginTop: "8px !important",
                    marginBottom: "8px !important",
                })}
            >
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
            <Grid
                container
                alignItems="flex-end"
                spacing={2}
                css={(theme) => ({
                    marginTop: "-8px !important",
                    marginLeft: "8px !important",
                })}
            >
                <Grid item>
                    <Typography style={{ fontSize: 18, marginBottom: 2 }}>
                        {props.index + 1}.
                    </Typography>
                </Grid>
                <Grid item xs style={{ paddingLeft: 0 }}>
                    <InputField fullWidth placeholder={label} onChange={onLabelChange} />
                </Grid>
                <Grid item>
                    <Grid container justify="flex-end">
                        <IconButton onClick={onDeleteDropdownButton} style={{ padding: 0 }}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>

            {props.addDropdownButton && props.questionFocused && (
                <Grid
                    container
                    alignItems="flex-end"
                    spacing={2}
                    css={theme => ({
                        marginTop: "-16px !important",
                        marginBottom: "8px !important",
                        marginLeft: "8px !important",
                    })}
                >
                    <Grid item>
                        <Typography style={{ fontSize: 18, marginBottom: 2 }}>
                            {props.index + 2}.
                        </Typography>
                    </Grid>
                    <Grid item xs style={{ paddingLeft: 0, paddingRight: 32 }}>
                        <InputField
                            fullWidth
                            placeholder={"Добавить вариант"}
                            onChange={onAddDropdownButton}
                        />
                    </Grid>
                    <Grid item />
                </Grid>
            )}
        </React.Fragment>
    );
};
