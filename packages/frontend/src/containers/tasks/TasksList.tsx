/** @jsx jsx */

import { jsx } from "@emotion/core";
import {
    Button,
    Dialog,
    IColumn,
    InputField,
    ITab,
    SelectField,
    TableWrapper,
    TabsWrapper,
} from "@magnit/components";
import { ETaskStatus } from "@magnit/entities";
import { AddIcon, ReturnIcon, SendIcon } from "@magnit/icons";
import { getFriendlyDate } from "@magnit/services";
import { Grid, MenuItem, Paper, Typography } from "@material-ui/core";
import { Link, Redirect, RouteComponentProps } from "@reach/router";
import { EmptyList } from "components/list";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { AppContext } from "context";
import _ from "lodash";
import * as React from "react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
    getAllRegions,
    getCitiesForRegion,
    getTasks,
    getTasksExtended,
    IExtendedTask,
    updateTask,
} from "services/api";

const tabs: ITab[] = [
    { value: ETaskStatus.IN_PROGRESS.replace("_", "-"), label: "В работе" },
    { value: ETaskStatus.ON_CHECK.replace("_", "-"), label: "На проверке" },
    { value: ETaskStatus.EXPIRED, label: "Просроченные" },
    { value: ETaskStatus.DRAFT, label: "Черновики" },
    { value: ETaskStatus.COMPLETED, label: "Завершенные" },
];

const columns: IColumn[] = [
    { key: "title", label: "Название задания", sortable: true },
    { key: "region", label: "Регион", sortable: true },
    { key: "city", label: "Филиал", sortable: true },
    { key: "format", label: "Формат", sortable: true },
    { key: "stageTitle", label: "Этап", sortable: true },
    { key: "deadline", label: "Срок выполнения", sortable: true },
];

type TRouteProps = { "*": string };

type TTask = IExtendedTask & { selected: boolean };

interface IUpdateTaskListOptions {
    sort?: "asc" | "desc";
    sortBy?: keyof Omit<TTask, "selected">;
    title?: string;
    region?: string;
    city?: string;
}

type TSelectChangeEvent = React.ChangeEvent<{ name?: string; value: unknown }>;

export const TasksList: React.FC<RouteComponentProps<TRouteProps>> = props => {
    const tab = props["*"]!;

    const context = useContext(AppContext);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [tasks, setTasks] = useState<TTask[]>([]);
    const [selectedTasks, setSelectedTasks] = useState<Map<number, TTask>>(new Map());
    const [searchQuery, setSearchQuery] = useState("");
    const [total, setTotal] = useState(0);

    const [selectedRegion, setSelectedRegion] = useState<string>("");
    const [selectedCity, setSelectedCity] = useState<string>("");
    const [marketplaceRegions, setMarketplaceRegions] = useState<string[]>([]);
    const [regionCities, setRegionCities] = useState<string[]>([]);

    const fetchRegionsAndUpdateState = useCallback(() => {
        getAllRegions(context.courier)
            .then(response => setMarketplaceRegions(response.regions))
            .catch(console.error);
    }, [context.courier]);

    const fetchCitiesAndUpdateState = useCallback(
        (region: string) => {
            getCitiesForRegion(context.courier, region)
                .then(response => setRegionCities(response.cities))
                .catch(console.error);
        },
        [context.courier],
    );

    const clearSelectedTasks = useCallback(() => {
        selectedTasks.clear();
        setSelectedTasks(new Map(selectedTasks));
    }, [selectedTasks]);

    const transformTaskDateToFriendly = useCallback(
        (task: IExtendedTask) => ({
            ...task,
            selected: false,
            createdAt: getFriendlyDate(new Date(task.createdAt!), true),
            updatedAt: getFriendlyDate(new Date(task.updatedAt!), true),
            deadline: getFriendlyDate(new Date(task.updatedAt!), true),
        }),
        [],
    );

    const fetchTaskAndUpdateState = useCallback(
        ({ sort, sortBy, title, region, city }: IUpdateTaskListOptions = {}) => {
            clearSelectedTasks();
            // get task by current status
            // also apply queries
            const upperCaseSort = (sort || "ASC").toUpperCase() as "ASC" | "DESC";
            getTasksExtended(
                context.courier,
                getTaskStatusByTab(tab),
                upperCaseSort,
                sortBy,
                title,
                region,
                city,
            )
                .then(response => setTasks(response.tasks.map(transformTaskDateToFriendly)))
                .catch(console.error);
            // get total count of all tasks
            getTasks(context.courier)
                .then(response => setTotal(response.tasks.length))
                .catch(console.error);
        },
        [clearSelectedTasks, context.courier, transformTaskDateToFriendly, tab],
    );

    const prevTab = useRef<string | null>(null);
    useEffect(() => {
        if (prevTab.current !== tab) {
            prevTab.current = tab;
            fetchTaskAndUpdateState();
            fetchRegionsAndUpdateState();
        }
    }, [tab, fetchTaskAndUpdateState, fetchRegionsAndUpdateState]);

    const prevTaskRegion = useRef(selectedRegion);
    useEffect(() => {
        if (!(selectedRegion && prevTaskRegion.current !== selectedRegion)) {
            return;
        }
        fetchCitiesAndUpdateState(selectedRegion);
    }, [fetchCitiesAndUpdateState, selectedRegion]);

    const [redirect, setRedirect] = useState({ redirect: false, to: "" });

    function onRowClick(row: object) {
        if (!_.isObject(row) || !_.has(row, "id")) {
            return;
        }
        setRedirect({ redirect: true, to: _.get(row, "id") });
    }

    const onRowSelectToggleCallback = useCallback(
        (row: object, selected: boolean) => {
            if (!_.isObject(row) || !_.has(row, "id")) {
                return;
            }
            // select or un-select tasks for rejecting
            const id = _.get(row, "id")!;
            if (selected) {
                selectedTasks.set(id, row as TTask);
            } else {
                selectedTasks.delete(id);
            }
            setSelectedTasks(new Map(selectedTasks));
            // update actual task
            const taskIndex = tasks.findIndex(task => task.id === id);
            if (taskIndex !== -1) {
                tasks[taskIndex].selected = selected;
                setTasks([...tasks]);
            }
        },
        [selectedTasks, tasks],
    );

    const setTaskToOnCheck = useCallback(
        async (task: TTask) =>
            updateTask(context.courier, Number(task.id), { status: ETaskStatus.ON_CHECK }),
        [context.courier],
    );

    const onBulkRejectClickCallback = useCallback(() => {
        const tasksToUpdate = [...selectedTasks.values()];

        const isNotInProgress = (task: TTask) => task.status !== ETaskStatus.IN_PROGRESS;

        // allow reject only tasks in IN_PROGRESS state
        if (tasksToUpdate.some(isNotInProgress)) {
            return;
        }

        // TODO: perform one request
        // https://github.com/DavidArutiunian/magnit/issues/88
        Promise.all(tasksToUpdate.map(setTaskToOnCheck))
            .then(() => fetchTaskAndUpdateState())
            .catch(console.error)
            .finally(onDialogClose);
    }, [selectedTasks, setTaskToOnCheck, fetchTaskAndUpdateState]);

    const setTaskToInProgress = useCallback(
        async (task: TTask) =>
            updateTask(context.courier, Number(task.id), { status: ETaskStatus.IN_PROGRESS }),
        [context.courier],
    );

    const onBulkCompleteClickCallback = useCallback(() => {
        const tasksToUpdate = [...selectedTasks.values()];

        const isNotDraftOrOnCheck = (task: TTask) =>
            ![ETaskStatus.DRAFT, ETaskStatus.ON_CHECK].includes(task.status);

        // allow complete only tasks in DRAFT & ON_CHECK states
        if (tasksToUpdate.some(isNotDraftOrOnCheck)) {
            return;
        }

        // TODO: perform one request
        // https://github.com/DavidArutiunian/magnit/issues/88
        Promise.all(tasksToUpdate.map(setTaskToInProgress))
            .then(() => fetchTaskAndUpdateState())
            .then(() => clearSelectedTasks())
            .catch(console.error);
    }, [clearSelectedTasks, selectedTasks, setTaskToInProgress, fetchTaskAndUpdateState]);

    const onSelectToggleCallback = useCallback(
        (selected: boolean) => {
            const nextTasks = tasks.map(task => ({ ...task, selected }));
            setTasks(nextTasks);
            if (selected) {
                nextTasks.forEach(task => task.id && selectedTasks.set(task.id, task));
                setSelectedTasks(new Map(selectedTasks));
            } else {
                clearSelectedTasks();
            }
        },
        [clearSelectedTasks, selectedTasks, tasks],
    );

    const updateTaskListDebounced = _.debounce(fetchTaskAndUpdateState, 150);

    const onSearchQueryChangeCallback = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            setSearchQuery(value);
            updateTaskListDebounced({
                title: value,
                region: selectedRegion,
                city: selectedCity,
            });
        },
        [selectedCity, selectedRegion, updateTaskListDebounced],
    );

    const onRequestSortCallback = useCallback(
        (sort: "asc" | "desc", sortBy: keyof Omit<TTask, "selected">) => {
            fetchTaskAndUpdateState({ sort, sortBy });
        },
        [fetchTaskAndUpdateState],
    );

    function onDialogOpen() {
        setDialogOpen(true);
    }

    function onDialogClose() {
        setDialogOpen(false);
    }

    const onRegionChangeCallback = useCallback(
        (event: TSelectChangeEvent) => {
            const value = event.target.value as string;
            setSelectedRegion(value);
            setSelectedCity("");
            updateTaskListDebounced({
                title: searchQuery,
                region: value,
            });
        },
        [searchQuery, updateTaskListDebounced],
    );

    const onCityChangeCallback = useCallback(
        (event: TSelectChangeEvent) => {
            const value = event.target.value as string;
            setSelectedCity(value);
            updateTaskListDebounced({
                title: searchQuery,
                region: selectedRegion,
                city: value,
            });
        },
        [searchQuery, selectedRegion, updateTaskListDebounced],
    );

    const empty = !total;

    return (
        <SectionLayout>
            <Dialog open={dialogOpen} onClose={onDialogClose} onSuccess={onBulkRejectClickCallback}>
                Вы действительно хотите отозвать задания?
            </Dialog>
            {redirect.redirect && <Redirect to={`tasks/view/${redirect.to}`} noThrow />}
            <SectionTitle title="Список заданий">
                {process.env.REACT_APP_ALLOW_CREATE_TASK && (
                    <Grid item hidden={empty}>
                        <Button component={Link} to="create" variant="contained" scheme="blue">
                            <AddIcon />
                            <Typography>Создать задание</Typography>
                        </Button>
                    </Grid>
                )}
            </SectionTitle>
            {empty && (
                <EmptyList
                    title="Заданий нет"
                    button={
                        <React.Fragment>
                            {process.env.REACT_APP_ALLOW_CREATE_TASK && (
                                <Grid item>
                                    <Button
                                        component={Link}
                                        to="create"
                                        variant="contained"
                                        scheme="blue"
                                    >
                                        <AddIcon />
                                        <Typography>Создать задание</Typography>
                                    </Button>
                                </Grid>
                            )}
                        </React.Fragment>
                    }
                >
                    {process.env.REACT_APP_ALLOW_CREATE_TASK && (
                        <React.Fragment>
                            <div>Для создания задания нажмите кнопку</div>
                            <div>Создать задание</div>
                        </React.Fragment>
                    )}
                </EmptyList>
            )}
            {!empty && (
                <Paper
                    square={true}
                    css={({ spacing, colors }) => ({
                        margin: spacing(3),
                        boxShadow: `0 0 ${spacing(2)} ${colors.lightGray} !important`,
                    })}
                >
                    <Grid container direction="row" css={theme => ({ padding: theme.spacing(2) })}>
                        <Grid item xs={12}>
                            <TabsWrapper tabs={tabs}>
                                <Grid
                                    container
                                    direction="column"
                                    css={theme => ({ padding: theme.spacing(4) })}
                                >
                                    <Grid item xs={12}>
                                        <Grid container direction="row" spacing={2}>
                                            <Grid item xs>
                                                <InputField
                                                    placeholder="Поиск ..."
                                                    fullWidth
                                                    value={searchQuery}
                                                    onChange={onSearchQueryChangeCallback}
                                                    css={({ spacing, ...theme }) => ({
                                                        borderRadius: theme.radius(5),
                                                        background: theme.colors.white,
                                                        border: `1px solid ${theme.colors.lightGray}`,
                                                        transition: "border 0.25s ease-in-out",
                                                        cursor: "pointer",
                                                        ":hover, :active": {
                                                            border: `1px solid ${theme.colors.primary}`,
                                                        },
                                                        div: {
                                                            ":before, :after": {
                                                                border: "none !important",
                                                            },
                                                        },
                                                        input: {
                                                            padding: `${spacing(2)} ${spacing(4)}`,
                                                        },
                                                    })}
                                                />
                                            </Grid>
                                            <Grid item xs={2}>
                                                <SelectField
                                                    placeholderDisabled={false}
                                                    value={selectedRegion}
                                                    placeholder="Выберите регион"
                                                    fullWidth
                                                    onChange={onRegionChangeCallback}
                                                >
                                                    {(marketplaceRegions || []).map(region => (
                                                        <MenuItem key={region} value={region}>
                                                            {region}
                                                        </MenuItem>
                                                    ))}
                                                </SelectField>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <SelectField
                                                    placeholderDisabled={false}
                                                    value={selectedCity}
                                                    placeholder="Выберите филиал"
                                                    fullWidth
                                                    onChange={onCityChangeCallback}
                                                >
                                                    {(regionCities || []).map(city => (
                                                        <MenuItem key={city} value={city}>
                                                            {city}
                                                        </MenuItem>
                                                    ))}
                                                </SelectField>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        xs={12}
                                        item
                                        css={theme => ({
                                            padding: theme.spacing(3),
                                            paddingLeft: 0,
                                            paddingRight: 0,
                                        })}
                                    >
                                        <TableWrapper
                                            css={theme => ({
                                                marginLeft: theme.spacing(-2),
                                                width: `calc(100% + ${theme.spacing(4)})`,
                                            })}
                                            selectable
                                            columns={columns}
                                            data={tasks}
                                            onRowClick={onRowClick}
                                            onRowSelectToggle={onRowSelectToggleCallback}
                                            onSelectToggle={onSelectToggleCallback}
                                            onRequestSort={onRequestSortCallback}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        {(tab === ETaskStatus.IN_PROGRESS.replace("_", "-") ||
                                            !tab) && (
                                            <Button
                                                variant="contained"
                                                scheme="blue"
                                                onClick={onDialogOpen}
                                            >
                                                <ReturnIcon />
                                                <Typography>Отозвать</Typography>
                                            </Button>
                                        )}
                                        {tab &&
                                            tab !== ETaskStatus.IN_PROGRESS.replace("_", "-") &&
                                            tab !== ETaskStatus.COMPLETED && (
                                                <Button
                                                    variant="contained"
                                                    scheme="blue"
                                                    onClick={onBulkCompleteClickCallback}
                                                >
                                                    <SendIcon />
                                                    <Typography>Отправить</Typography>
                                                </Button>
                                            )}
                                    </Grid>
                                </Grid>
                            </TabsWrapper>
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </SectionLayout>
    );
};

TasksList.displayName = "TasksList";

function getTaskStatusByTab(tab?: string): ETaskStatus {
    if (!tab) {
        return ETaskStatus.IN_PROGRESS;
    }
    return ((tab as unknown) as string).replace("-", "_") as ETaskStatus;
}
