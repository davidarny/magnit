/** @jsx jsx */

import { jsx } from "@emotion/core";
import { EditorToolbar, SelectableBlockWrapper } from "@magnit/components";
import { ITemplate } from "@magnit/entities";
import { GroupIcon, QuestionIcon, SectionIcon, TrashIcon } from "@magnit/icons";
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary } from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import _ from "lodash";
import * as React from "react";
import { useContext, useMemo } from "react";
import { SectionHead } from "./components/section-head";
import { SectionWrapper } from "./components/section-wrapper";
import { EditorContext } from "./context";
import { useTemplate } from "./hooks/template";

interface ITemplateEditorProps {
    template: ITemplate;

    onChange?(template: ITemplate): void;

    onAddAsset?(file: File): Promise<{ filename: string }>;

    onDeleteAsset?(filename: string): Promise<unknown>;
}

export const TemplateEditor: React.FC<ITemplateEditorProps> = props => {
    const { template, onChange: onTemplateChange, onDeleteAsset, onAddAsset } = props;

    const context = useContext(EditorContext);

    const [
        cache,
        service,
        toolbarTopPosition,
        focusedPuzzleChain,
        onToolbarAddQuestion,
        onToolbarAddGroup,
        onToolbarAddSection,
        onAddAnswerPuzzle,
        onDeleteAnswerPuzzle,
        onDeletePuzzle,
        onTemplateChangeCallback,
    ] = useTemplate(template, onTemplateChange);

    const focusedPuzzleId = _.first(focusedPuzzleChain);
    const focusedOnTemplateHead = focusedPuzzleId === template.id.toString();

    context.template = template;
    context.cache = cache.current;
    context.onDeleteAsset = onDeleteAsset || context.onDeleteAsset;
    context.onUploadAsset = onAddAsset || context.onUploadAsset;
    context.onTemplateChange = onTemplateChangeCallback;
    context.onAddAnswerPuzzle = onAddAnswerPuzzle;
    context.onDeleteAnswerPuzzle = onDeleteAnswerPuzzle;

    const editorToolbarItems = useMemo(
        () => [
            ...(focusedOnTemplateHead
                ? []
                : [
                      {
                          label: "Добавить вопрос",
                          icon: <QuestionIcon />,
                          action: onToolbarAddQuestion,
                      },
                      {
                          label: "Добавить группу",
                          icon: <GroupIcon />,
                          action: onToolbarAddGroup,
                      },
                  ]),
            {
                label: "Добавить раздел",
                icon: <SectionIcon />,
                action: onToolbarAddSection,
            },
            ...(focusedOnTemplateHead
                ? []
                : [
                      {
                          label: "Удалить элемент",
                          icon: <TrashIcon css={theme => ({ color: theme.colors.gray })} />,
                          action: onDeletePuzzle,
                      },
                  ]),
        ],
        [
            focusedOnTemplateHead,
            onDeletePuzzle,
            onToolbarAddGroup,
            onToolbarAddQuestion,
            onToolbarAddSection,
        ],
    );

    const json: any[] = [];

    return (
        <React.Fragment>
            <EditorToolbar top={toolbarTopPosition} items={editorToolbarItems} />
            <SelectableBlockWrapper
                id={template.id.toString()}
                css={theme => ({
                    paddingTop: theme.spacing(3),
                    marginBottom: theme.spacing(2),
                })}
                focused={focusedPuzzleId === template.id.toString()}
                onFocus={service.current.onPuzzleFocus.bind(
                    service.current,
                    template.id.toString(),
                    false,
                )}
                onMouseDown={service.current.onPuzzleFocus.bind(
                    service.current,
                    template.id.toString(),
                    false,
                )}
            >
                <SectionHead
                    template={template}
                    focused={focusedPuzzleId === template.id.toString()}
                    onTemplateChange={onTemplateChange}
                />
            </SelectableBlockWrapper>
            {(template.sections || []).map((section, index) => (
                <SectionWrapper
                    key={section.id}
                    section={section}
                    index={index}
                    focusedPuzzleId={focusedPuzzleId}
                    onTemplateChange={onTemplateChangeCallback}
                    onPuzzleFocus={service.current.onPuzzleFocus.bind(service.current)}
                />
            ))}
            {process.env.NODE_ENV !== "production" && (
                <ExpansionPanel css={theme => ({ marginTop: theme.spacing(3) })}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        JSON
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <pre>
                            {JSON.stringify(
                                template,
                                (key, value) => {
                                    if (typeof value === "object" && value !== null) {
                                        if (json.indexOf(value) !== -1) {
                                            return;
                                        }
                                        json.push(value);
                                    }
                                    return value;
                                },
                                2,
                            )}
                        </pre>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            )}
        </React.Fragment>
    );
};

TemplateEditor.displayName = "TemplateEditor";
