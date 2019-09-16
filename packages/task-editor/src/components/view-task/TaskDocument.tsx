/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Checkbox, SelectableBlockWrapper, SelectField } from "@magnit/components";
import { IDocument, IVirtualDocument, IWithAnswers } from "@magnit/entities";
import { IEditorService } from "@magnit/services";
import { FormControl, FormControlLabel, Grid, MenuItem, Typography } from "@material-ui/core";
import { TemplateRenderer } from "components/renderers";
import _ from "lodash";
import * as React from "react";
import { useCallback } from "react";

type TSelectChangeEvent = React.ChangeEvent<{
    name?: string;
    value: unknown;
}>;

interface ITaskDocumentProps {
    documents: IVirtualDocument[];
    document: IVirtualDocument;
    service: IEditorService;
    focusedPuzzleId?: string;
    templateSnapshots: Map<string, object>;
    templates: Array<IDocument & IWithAnswers>;
    editable: boolean;

    onEditableChange?(documentId: number, editable: boolean): void;

    onTemplateChange?(uuid: string, event: TSelectChangeEvent): void;
}

export const TaskDocument: React.FC<ITaskDocumentProps> = props => {
    const {
        focusedPuzzleId,
        service,
        document,
        templates,
        documents,
        templateSnapshots,
        editable,
    } = props;
    const { onEditableChange, onTemplateChange } = props;

    const snapshot = templateSnapshots.get(document.id.toString());
    const focused = focusedPuzzleId === document.__uuid;

    const answers = templates
        .filter(template => template.id === document.id)
        .flatMap(template => template.answers || []);

    const onEditableChangeCallback = useCallback(
        (event: TSelectChangeEvent, checked: boolean) => {
            if (onEditableChange) {
                onEditableChange(document.id, checked);
            }
        },
        [document.id, onEditableChange],
    );

    const onTemplateChangeCallback = useCallback(
        (event: TSelectChangeEvent) => {
            if (onTemplateChange) {
                onTemplateChange(document.__uuid, event);
            }
        },
        [document.__uuid, onTemplateChange],
    );

    return (
        <SelectableBlockWrapper
            onFocus={service.onPuzzleFocus.bind(service, document.__uuid, false)}
            onMouseDown={service.onPuzzleFocus.bind(service, document.__uuid, false)}
            css={theme => ({
                padding: theme.spacing(3),
                zIndex: focusedPuzzleId === document.__uuid ? 1300 : "initial",
            })}
            focused={focused}
            id={document.__uuid}
        >
            {editable && document.virtual && (
                <Grid item xs={3} css={theme => ({ paddingLeft: theme.spacing(3) })}>
                    <SelectField
                        placeholder="Выбрать шаблон"
                        value={document.id === -1 ? "" : document.id}
                        fullWidth
                        onChange={onTemplateChangeCallback}
                    >
                        {templates
                            .filter(template =>
                                document.id !== template.id
                                    ? !documents.find(document => document.id === template.id)
                                    : true,
                            )
                            .map(template => (
                                <MenuItem key={template.id} value={template.id}>
                                    {template.title}
                                </MenuItem>
                            ))}
                    </SelectField>
                </Grid>
            )}
            <Grid container css={theme => ({ padding: `0 ${theme.spacing(4)}` })}>
                <Grid item xs={9}>
                    <Typography css={theme => ({ fontSize: theme.fontSize.xLarge })}>
                        {_.get(snapshot, "title")}
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <Grid container justify="center" alignItems="flex-end">
                        <FormControl>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        disabled={!editable}
                                        checked={document.editable}
                                        css={theme => ({ marginRight: theme.spacing() })}
                                        onChange={onEditableChangeCallback}
                                    />
                                }
                                label="Разрешить редактирование"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    {focused && <TemplateRenderer answers={answers} template={snapshot} />}
                </Grid>
            </Grid>
        </SelectableBlockWrapper>
    );
};

TaskDocument.displayName = "TaskDocument";
