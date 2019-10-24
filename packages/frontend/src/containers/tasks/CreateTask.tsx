/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Button } from "@magnit/components";
import { ETaskStatus, ITask, ITemplate, IUser } from "@magnit/entities";
import { SendIcon } from "@magnit/icons";
import { TaskEditor } from "@magnit/task-editor";
import { Grid, Typography } from "@material-ui/core";
import { RouteComponentProps } from "@reach/router";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { Snackbar } from "components/snackbar";
import { AppContext } from "context";
import _ from "lodash";
import * as React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import {
    addTemplateAssignment,
    createTask,
    getAddressesForFormat,
    getAllRegions,
    getCitiesForRegion,
    getFormatsForCity,
    getTemplates,
} from "services/api";

export interface ICreateTaskProps extends RouteComponentProps {
    username: string;
    users: IUser[];
}

export const CreateTask: React.FC<ICreateTaskProps> = props => {
    const { users, username } = props;

    const context = useContext(AppContext);

    // all templates
    const [templates, setTemplates] = useState<ITemplate[]>([]);

    // task state
    const owner = users.find(user => user.username === username);
    const [task, setTask] = useState<ITask>({
        id: 0,
        title: "",
        templates: [],
        stages: [],
        marketplace: {
            address: "",
            city: "",
            format: "",
            region: "",
        },
        status: ETaskStatus.DRAFT,
        idOwner: owner ? owner.id : "",
    });

    // snackbar
    // deprecated, should be used within context
    const [error, setError] = useState(false); // success/error snackbar state
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
    }); // open/close snackbar

    // marketplace
    const [marketplaceRegions, setMarketplaceRegions] = useState<string[]>([]);
    const [regionCities, setRegionCities] = useState<string[]>([]);
    const [cityFormats, setCityFormats] = useState<string[]>([]);
    const [formatAddresses, setFormatAddresses] = useState<string[]>([]);

    useEffect(() => {
        getTemplates(context.courier)
            .then(response => setTemplates([...response.templates]))
            .catch(console.error);
    }, [context.courier]);

    useEffect(() => {
        // only draft mode contains marketplace selects
        if (task.status !== ETaskStatus.DRAFT) {
            return;
        }
        getAllRegions(context.courier)
            .then(response => setMarketplaceRegions(response.regions))
            .catch(console.error);
    }, [context.courier, task.status]);

    // get all regions initially
    const region = (task.marketplace || {}).region;
    const prevTaskRegion = useRef(region);
    useEffect(() => {
        if (region && prevTaskRegion.current !== region) {
            getCitiesForRegion(context.courier, region)
                .then(response => setRegionCities(response.cities))
                .catch(console.error);
        }
    }, [context.courier, region]);

    // fetching all available formats for city
    // if task marketplace city has changed
    const city = (task.marketplace || {}).city;
    const prevTaskCity = useRef(city);
    useEffect(() => {
        if (city && region && prevTaskCity.current !== city) {
            getFormatsForCity(context.courier, region, city)
                .then(response => setCityFormats(response.formats))
                .catch(console.error);
        }
    }, [context.courier, region, city]);

    // fetching all available addresses for format
    // if task marketplace format has changed
    const format = (task.marketplace || {}).format;
    const prevTaskFormat = useRef(format);
    useEffect(() => {
        if (city && region && format && prevTaskFormat.current !== format) {
            getAddressesForFormat(context.courier, region, city, format)
                .then(response => setFormatAddresses(response.addresses))
                .catch(console.error);
        }
    }, [context.courier, format, region, city]);

    function onSnackbarClose(event?: React.SyntheticEvent, reason?: string) {
        if (reason === "clickaway") {
            return;
        }
        setSnackbar({ open: false, message: "" });
        // wait till animation ends
        setTimeout(() => setError(false), 100);
    }

    function onTaskChange(task: Partial<ITask>): void {
        const isValidTask = (value: object): value is ITask =>
            _.has(value, "id") && _.has(value, "title") && _.has(value, "templates");

        if (isValidTask(task)) {
            setTask({ ...task });
        }
    }

    function onTaskSave(): void {
        createTask(context.courier, task)
            .then(async response =>
                addTemplateAssignment(
                    context.courier,
                    Number(response.taskId),
                    (task.templates || []).map(_.toNumber),
                ),
            )
            .then(() => setSnackbar({ open: true, message: "Задание успешно сохранено!" }))
            .catch(() => {
                setSnackbar({ open: true, message: "Ошибка сохранения задания!" });
                setError(true);
            });
    }

    return (
        <SectionLayout>
            <SectionTitle title="Создание задания">
                <Grid item>
                    <Button
                        variant="contained"
                        scheme="blue"
                        css={theme => ({ margin: `0 ${theme.spacing(1)}` })}
                        onClick={onTaskSave}
                        disabled={snackbar.open}
                    >
                        <SendIcon />
                        <Typography>Отправить</Typography>
                    </Button>
                </Grid>
            </SectionTitle>
            <Grid
                css={theme => ({
                    maxWidth: theme.maxTemplateWidth,
                    margin: theme.spacing(4),
                    position: "relative",
                    transition: "opacity 0.3s ease-in-out",
                })}
            >
                <TaskEditor<ITask>
                    users={users}
                    variant="create"
                    task={task}
                    templates={templates}
                    regions={marketplaceRegions}
                    cities={regionCities}
                    formats={cityFormats}
                    addresses={formatAddresses}
                    onTaskChange={onTaskChange}
                />
            </Grid>
            <Snackbar
                open={snackbar.open}
                error={error}
                onClose={onSnackbarClose}
                message={snackbar.message}
            />
        </SectionLayout>
    );
};
