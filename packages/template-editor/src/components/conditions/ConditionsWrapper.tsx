/** @jsx jsx */

import { jsx } from "@emotion/core";
import { EPuzzleType, IPuzzle, ISection } from "@magnit/entities";
import { Grid, Tab, Tabs } from "@material-ui/core";
import { EditorContext } from "context";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { Conditions } from "./Conditions";
import { Validations } from "./Validations";

interface IContentConditionsProps {
    puzzle: IPuzzle;
    parent: IPuzzle | ISection;
    focused: boolean;
    answerType?: EPuzzleType;
    alwaysVisible?: boolean;
}

export const ConditionsWrapper: React.FC<IContentConditionsProps> = props => {
    const { focused, puzzle, parent, answerType, alwaysVisible = false } = props;

    const context = useContext(EditorContext);
    const { onTemplateChange } = context;

    const [tab, setTab] = useState(0);

    function onTabChange(event: React.ChangeEvent<unknown>, nextTab: number): void {
        setTab(nextTab);
    }

    // reset tab if question type changed
    useEffect(() => setTab(0), [answerType]);

    const conditionsTitle =
        puzzle.puzzleType === EPuzzleType.GROUP
            ? "Условия показа группы"
            : "Условия показа вопроса";

    const validationsTitle =
        puzzle.puzzleType === EPuzzleType.QUESTION ? "Условия валидации поля ответа" : "";

    const validationsEnabled = answerType === EPuzzleType.NUMERIC_ANSWER;

    return (
        <Grid
            container
            css={theme => ({
                marginTop: theme.spacing(2),
                paddingLeft: theme.spacing(4),
                paddingRight: theme.spacing(4),
                display: alwaysVisible ? "flex" : focused ? "flex" : "none",
                opacity: !focused ? 0.8 : 1,
            })}
        >
            <Grid
                item
                xs={12}
                css={theme => ({
                    background: !focused ? "none" : theme.colors.light,
                    paddingTop: theme.spacing(2),
                    paddingLeft: theme.spacing(2),
                    paddingBottom: theme.spacing(2),
                })}
            >
                <Tabs
                    value={tab}
                    onChange={onTabChange}
                    css={theme => ({
                        ".indicator": {
                            backgroundColor: theme.colors.primary,
                            boxShadow: theme.boxShadow.indicator,
                            borderTopLeftRadius: theme.radius(0.5),
                            borderTopRightRadius: theme.radius(0.5),
                            height: "3px",
                            // hide via `width` so that animation works
                            // when indicator appears
                            ...(!validationsEnabled ? { width: "0px !important" } : {}),
                        },
                    })}
                    classes={{ indicator: "indicator" }}
                >
                    <Tab
                        css={theme => ({
                            textTransform: "none",
                            paddingTop: 0,
                            paddingBottom: 0,
                            paddingLeft: theme.spacing(),
                            paddingRight: theme.spacing(),
                            maxWidth: "max-content",
                            fontSize: theme.fontSize.normal,
                            letterSpacing: "normal",
                            marginRight: theme.spacing(5),
                        })}
                        label={conditionsTitle}
                    />
                    {!!validationsTitle && validationsEnabled && (
                        <Tab
                            label={validationsTitle}
                            css={theme => ({
                                textTransform: "none",
                                paddingTop: 0,
                                paddingBottom: 0,
                                paddingLeft: theme.spacing(),
                                paddingRight: theme.spacing(),
                                maxWidth: "max-content",
                                fontSize: theme.fontSize.normal,
                                letterSpacing: "normal",
                            })}
                        />
                    )}
                </Tabs>
            </Grid>
            <Grid
                item
                xs={12}
                css={theme => ({
                    paddingLeft: theme.spacing(3),
                    paddingRight: theme.spacing(3),
                    paddingBottom: theme.spacing(3),
                    background: !focused ? "none" : theme.colors.light,
                })}
            >
                <div css={{ display: tab === 0 ? "block" : "none" }}>
                    <Conditions
                        puzzle={puzzle}
                        parent={parent}
                        puzzles={context.cache.puzzles}
                        disabled={alwaysVisible ? false : !focused || tab !== 0}
                        onTemplateChange={onTemplateChange}
                        focused={focused}
                    />
                </div>
                <div css={{ display: tab === 1 && validationsEnabled ? "block" : "none" }}>
                    <Validations
                        puzzle={puzzle}
                        parent={parent}
                        puzzles={context.cache.puzzles}
                        disabled={alwaysVisible ? false : !focused || tab !== 1}
                        onTemplateChange={onTemplateChange}
                        focused={focused}
                    />
                </div>
            </Grid>
        </Grid>
    );
};

ConditionsWrapper.displayName = "ConditionsWrapper";
