/* eslint-disable react-hooks/exhaustive-deps */
/** @jsx jsx */

import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { Grid, IconButton, Radio, Typography } from "@material-ui/core";
import { css, jsx } from "@emotion/core";
import { IFocusedPuzzleProps, IPuzzle, ITemplate, TChangeEvent } from "entities";
import { traverse } from "services/json";
import { Close as DeleteIcon } from "@material-ui/icons";
import { InputField } from "@magnit/components";
import _ from "lodash";

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

export const RadioAnswer: React.FC<IRadioAnswerPuzzleProps> = ({ focused, ...props }) => {
    const [label, setLabel] = useState(props.title || `Вариант ${props.index + 1}`);

    const onTemplateChange = useCallback(() => {
        traverse(props.template, (puzzle: IPuzzle) => {
            if (!_.has(puzzle, "id")) {
                return;
            }
            if (puzzle.id !== props.id) {
                return;
            }
            puzzle.title = label;
            return true;
        });
        props.onTemplateChange({ ...props.template });
    }, [label]);

    useEffect(() => onTemplateChange(), [focused]);

    function onLabelChange(event: TChangeEvent): void {
        setLabel(event.target.value as string);
    }

    function onAddRadioButton(): void {
        props.onAddRadioButton(props.id);
    }

    function onDeleteRadioButton(): void {
        props.onDeleteRadioButton(props.id);
    }

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
                alignItems="center"
                spacing={2}
                css={theme => ({ marginTop: `${theme.spacing(-1)} !important` })}
            >
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
                    css={css`
                        padding-left: 0 !important;
                    `}
                >
                    <InputField
                        fullWidth
                        value={label}
                        onChange={onLabelChange}
                        onBlur={onTemplateChange}
                    />
                </Grid>
                <Grid item css={theme => ({ padding: `${theme.spacing(0.25)} !important` })}>
                    <IconButton onClick={onDeleteRadioButton}>
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>

            {props.addRadioButton && focused && (
                <Grid
                    container
                    alignItems="flex-end"
                    spacing={2}
                    css={theme => ({
                        paddingTop: theme.spacing(),
                        marginBottom: `${theme.spacing()} !important`,
                    })}
                >
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
                        css={css`
                            padding-top: 0 !important;
                            padding-left: 0 !important;
                        `}
                    >
                        <InputField
                            fullWidth
                            placeholder={"Добавить вариант"}
                            onFocus={onAddRadioButton}
                        />
                    </Grid>
                    <Grid item />
                </Grid>
            )}
        </React.Fragment>
    );
};
