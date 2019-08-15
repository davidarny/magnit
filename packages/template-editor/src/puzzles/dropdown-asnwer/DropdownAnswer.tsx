/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import { InputField } from "@magnit/components";
import { Grid, IconButton, Typography } from "@material-ui/core";
import { Close as DeleteIcon } from "@material-ui/icons";
import { IFocusedPuzzleProps, IPuzzle, ITemplate, TChangeEvent } from "entities";
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

export const DropdownAnswer: React.FC<IDropdownAnswerPuzzleProps> = props => {
    const { focused, template, addDropdownButton, index, id, title } = props;
    const { onAddDropdownButton, onTemplateChange, onDeleteDropdownButton } = props;

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
    }, [label, template, id, onTemplateChange]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => onTemplateChangeCallback(), [focused]);

    function onLabelChange(event: TChangeEvent): void {
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
            <Grid
                container
                alignItems="center"
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
                        {index + 1}.
                    </Typography>
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
                            {index + 2}.
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
                            onFocus={onAddDropdownButtonCallback}
                        />
                    </Grid>
                </Grid>
            )}
        </React.Fragment>
    );
};
