/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import { InputField } from "@magnit/components";
import { Checkbox, Grid, IconButton, Typography } from "@material-ui/core";
import { Close as DeleteIcon } from "@material-ui/icons";
import { IFocusedPuzzleProps, IPuzzle, ITemplate, TChangeEvent } from "entities";
import _ from "lodash";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { traverse } from "services/json";

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

export const CheckboxAnswer: React.FC<ICheckboxAnswerPuzzleProps> = props => {
    const { focused, template, index, addCheckboxButton, id, title } = props;
    const { onTemplateChange, onAddCheckboxButton, onDeleteCheckboxButton } = props;

    const [label, setLabel] = useState(title || `Вариант ${index + 1}`);

    function onLabelChange(event: TChangeEvent): void {
        setLabel(event.target.value as string);
    }

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
    }, [label, template, onTemplateChange, id]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => onTemplateChangeCallback(), [focused]);

    const onAddCheckboxButtonCallback = useCallback(() => {
        onAddCheckboxButton(id);
    }, [onAddCheckboxButton, id]);

    const onDeleteCheckboxButtonCallback = useCallback(() => {
        onDeleteCheckboxButton(id);
    }, [onDeleteCheckboxButton, id]);

    if (!focused) {
        return (
            <Grid
                container
                alignItems="center"
                css={theme => ({ marginTop: `${theme.spacing()} !important` })}
            >
                <Grid item>
                    <Checkbox disabled css={theme => ({ marginLeft: `-${theme.spacing()}` })} />
                </Grid>
                <Grid item>
                    <Typography
                        css={theme => ({ color: !label ? theme.colors.gray : "initial" })}
                        variant="body1"
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
                    <IconButton onClick={onDeleteCheckboxButtonCallback}>
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>
            {addCheckboxButton && focused && (
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
                        css={css`
                            padding-top: 0 !important;
                            padding-left: 0 !important;
                        `}
                    >
                        <InputField
                            fullWidth
                            placeholder={"Добавить вариант"}
                            onFocus={onAddCheckboxButtonCallback}
                        />
                    </Grid>
                </Grid>
            )}
        </React.Fragment>
    );
};
