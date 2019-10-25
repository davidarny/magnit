/** @jsx jsx */

import { jsx } from "@emotion/core";
import { IColumn, TableWrapper } from "@magnit/components";
import { Grid, Paper } from "@material-ui/core";
import { RouteComponentProps } from "@reach/router";
import { EmptyList } from "components/list";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { AppContext } from "context";
import { useMarketplaces } from "hooks";
import { useContext } from "react";

const columns: IColumn[] = [
    { key: "region", label: "Регион", sortable: false },
    { key: "city", label: "Филиал", sortable: false },
    { key: "address", label: "Адрес", sortable: false },
    { key: "format", label: "Формат", sortable: false },
];

export interface IMarketplaceListProps extends RouteComponentProps {}

export const MarketplaceList: React.FC<IMarketplaceListProps> = () => {
    const context = useContext(AppContext);

    const marketplaces = useMarketplaces(context.courier);

    const empty = !marketplaces.length;

    return (
        <SectionLayout>
            <SectionTitle title="Список объектов" />
            {empty && <EmptyList title="Объеков нет" />}
            {!empty && (
                <Paper
                    square={true}
                    css={({ spacing, boxShadow }) => ({
                        margin: spacing(3),
                        boxShadow: boxShadow.paper,
                    })}
                >
                    <Grid
                        container
                        direction="row"
                        css={theme => ({ marginTop: theme.spacing(2) })}
                    >
                        <Grid xs={12} item css={theme => ({ padding: theme.spacing(3) })}>
                            <TableWrapper columns={columns} data={marketplaces} />
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </SectionLayout>
    );
};

MarketplaceList.displayName = "MarketplaceList";
