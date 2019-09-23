/** @jsx jsx */

import { jsx } from "@emotion/core";
import { InputField } from "@magnit/components";
import { IFocusedPuzzleProps, IPuzzle, ITemplate } from "@magnit/entities";
import { Grid, IconButton, Typography } from "@material-ui/core";
import { Close as DeleteIcon } from "@material-ui/icons";
import _ from "lodash";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { traverse } from "services/json";

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

type TSelectChangeEvent = React.ChangeEvent<{
    name?: string;
    value: unknown;
}>;

export const DropdownAnswer: React.FC<IDropdownAnswerPuzzleProps> = props => {
    const { focused, template, addDropdownButton, index, id, title } = props;
    const { onAddDropdownButton, onTemplateChange, onDeleteDropdownButton } = props;

    const [label, setLabel] = useState(title || `Вариант ${index + 1}`);

    const onTemplateChangeCallback = useCallback(() => {
        traverse(template, (puzzle: IPuzzle) => {
            if (!_.has(puzzle, "id") || puzzle.id !== id) {
                return;
            }
            puzzle.title = label;
            return true;
        });
        onTemplateChange(template);
    }, [label, template, id, onTemplateChange]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => onTemplateChangeCallback(), [focused]);

    function onLabelChange(event: TSelectChangeEvent): void {
        setLabel(event.target.value as string);
    }

    const onAddDropdownButtonCallback = useCallback(() => {
        onAddDropdownButton(id);
    }, [onAddDropdownButton, id]);

    const onDeleteDropdownButtonCallback = useCallback(() => {
        onDeleteDropdownButton(id);
    }, [onDeleteDropdownButton, id]);

    if (!focused) {
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
                        {index + 1}.
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography
                        variant="body1"
                        component="span"
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
            <Grid container alignItems="center" spacing={2}>
                <Grid item>
                    <Typography css={theme => ({ fontSize: theme.fontSize.medium })}>
                        {index + 1}.
                    </Typography>
                </Grid>
                <Grid item xs>
                    <InputField
                        fullWidth
                        value={label}
                        onChange={onLabelChange}
                        onBlur={onTemplateChangeCallback}
                    />
                </Grid>
                <Grid item>
                    <IconButton onClick={onDeleteDropdownButtonCallback}>
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>

            {addDropdownButton && focused && (
                <Grid
                    container
                    alignItems="flex-end"
                    spacing={2}
                    css={theme => ({ marginTop: theme.spacing(-2) })}
                >
                    <Grid item>
                        <Typography
                            css={theme => ({
                                fontSize: theme.fontSize.medium,
                                position: "relative",
                                top: theme.spacing(-1),
                            })}
                        >
                            {index + 2}.
                        </Typography>
                    </Grid>
                    <Grid item xs>
                        <InputField
                            fullWidth
                            placeholder="Добавить вариант"
                            onFocus={onAddDropdownButtonCallback}
                        />
                    </Grid>
                    <Grid item css={{ visibility: "hidden" }}>
                        <IconButton onClick={onDeleteDropdownButtonCallback}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            )}
        </React.Fragment>
    );
};
