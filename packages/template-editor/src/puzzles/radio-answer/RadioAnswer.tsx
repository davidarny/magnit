/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import { InputField } from "@magnit/components";
import { IFocusedPuzzleProps, IPuzzle, ITemplate } from "@magnit/entities";
import { Grid, IconButton, Radio, Typography } from "@material-ui/core";
import { Close as DeleteIcon } from "@material-ui/icons";
import _ from "lodash";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { traverse } from "services/json";

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

type TSelectChangeEvent = React.ChangeEvent<{
    name?: string;
    value: unknown;
}>;

export const RadioAnswer: React.FC<IRadioAnswerPuzzleProps> = props => {
    const { addRadioButton, id, index, title, template, focused } = props;
    const { onTemplateChange, onAddRadioButton, onDeleteRadioButton } = props;

    const [label, setLabel] = useState(title || `Вариант ${index + 1}`);

    const onTemplateChangeCallback = useCallback(() => {
        traverse(template, (puzzle: IPuzzle) => {
            if (!_.has(puzzle, "id")) {
                return;
            }
            if (puzzle.id !== id) {
                return;
            }
            puzzle.title = label;
            return true;
        });
        onTemplateChange(template);
    }, [label, id, template, onTemplateChange]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => onTemplateChangeCallback(), [focused]);

    function onLabelChange(event: TSelectChangeEvent): void {
        setLabel(event.target.value as string);
    }

    const onAddRadioButtonCallback = useCallback(() => {
        onAddRadioButton(id);
    }, [id, onAddRadioButton]);

    const onDeleteRadioButtonCallback = useCallback(() => {
        onDeleteRadioButton(id);
    }, [onDeleteRadioButton, id]);

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
                        onBlur={onTemplateChangeCallback}
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
