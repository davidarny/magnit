/* eslint-disable react-hooks/exhaustive-deps */
/** @jsx jsx */

import * as React from "react";
import { useEffect, useState } from "react";
import { Grid, IconButton, Typography } from "@material-ui/core";
import { css, jsx } from "@emotion/core";
import { IFocusedPuzzleProps, IPuzzle, ITemplate, TChangeEvent } from "entities";
import { traverse } from "services/json";
import { Close as DeleteIcon } from "@material-ui/icons";
import { InputField } from "@magnit/components";
import _ from "lodash";

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
            if (!_.isObject(value) || !("puzzles" in value)) {
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

    if (!props.focused) {
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
                        {props.index + 1}.
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography
                        variant="body1"
                        component="span"
                        css={theme => ({ color: !label ? theme.colors.gray : "initial" })}
                    >
                        {label || `Вариант ${props.index + 1}`}
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
                css={theme => ({
                    marginTop: `${theme.spacing(-1)} !important`,
                    marginLeft: "0 !important",
                })}
            >
                <Grid item>
                    <Typography
                        css={theme => ({
                            fontSize: theme.fontSize.medium,
                            paddingBottom: theme.spacing(0.25),
                            marginLeft: `-${theme.spacing()}`,
                            marginRight: theme.spacing(2),
                        })}
                    >
                        {props.index + 1}.
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs
                    css={css`
                        padding-left: 0 !important;
                    `}
                >
                    <InputField fullWidth value={label} onChange={onLabelChange} />
                </Grid>
                <Grid item css={theme => ({ padding: `${theme.spacing(0.25)} !important` })}>
                    <IconButton onClick={onDeleteDropdownButton}>
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>

            {props.addDropdownButton && props.focused && (
                <Grid
                    container
                    alignItems="flex-end"
                    spacing={2}
                    css={theme => ({
                        paddingTop: theme.spacing(),
                        marginBottom: `${theme.spacing()} !important`,
                        marginLeft: "0 !important",
                    })}
                >
                    <Grid item>
                        <Typography
                            css={theme => ({
                                fontSize: theme.fontSize.medium,
                                marginLeft: `-${theme.spacing()}`,
                                paddingBottom: theme.spacing(0.5),
                                marginRight: theme.spacing(2),
                            })}
                        >
                            {props.index + 2}.
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs
                        css={css`
                            padding-top: 0 !important;
                            padding-left: 0 !important;
                        `}
                    >
                        <InputField
                            fullWidth
                            placeholder={"Добавить вариант"}
                            onClick={onAddDropdownButton}
                        />
                    </Grid>
                </Grid>
            )}
        </React.Fragment>
    );
};
