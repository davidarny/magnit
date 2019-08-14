/** @jsx jsx */

import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { jsx } from "@emotion/core";
import { EditorContext } from "context";
import { Conditions } from "./Conditions";
import { Validations } from "./Validations";
import { EPuzzleType } from "@magnit/services";
import { Grid, Tab, Tabs } from "@material-ui/core";
import { ICondition, IValidation } from "entities";

interface IContentConditionsProps {
    puzzleId: string;
    focused: boolean;
    conditions: ICondition[];
    validations: IValidation[];
    puzzleType: EPuzzleType;
    answerType?: EPuzzleType;
    alwaysVisible?: boolean;
}

export const ConditionsWrapper: React.FC<IContentConditionsProps> = props => {
    const context = useContext(EditorContext);
    const { onTemplateChange, template } = context;
    const [tab, setTab] = useState(0);

    const { puzzleId, focused, puzzleType, answerType, alwaysVisible = false } = props;

    function onTabChange(event: React.ChangeEvent<{}>, nextTab: number): void {
        setTab(nextTab);
    }

    // reset tab if question type changed
    useEffect(() => setTab(0), [answerType]);

    const conditionsTitle =
        puzzleType === EPuzzleType.GROUP ? "Условия показа группы" : "Условия показа вопроса";

    const validationsTitle =
        puzzleType === EPuzzleType.QUESTION ? "Условия валидации поля ответа" : "";

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
                        disabled={alwaysVisible ? false : !focused || tab !== 1}
                        puzzleId={puzzleId}
                        initialState={props.conditions}
                        onTemplateChange={onTemplateChange}
                        template={template}
                        focused={focused}
                    />
                </div>
                <div css={{ display: tab === 1 && validationsEnabled ? "block" : "none" }}>
                    <Validations
                        disabled={alwaysVisible ? false : !focused || tab !== 1}
                        puzzleId={puzzleId}
                        initialState={props.validations}
                        onTemplateChange={onTemplateChange}
                        template={template}
                        focused={focused}
                    />
                </div>
            </Grid>
        </Grid>
    );
};
