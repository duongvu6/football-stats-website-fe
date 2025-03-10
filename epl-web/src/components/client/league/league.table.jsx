// epl-web/src/components/client/league/league.table.jsx
import BaseLeagueTable from "../../shared/league/base.league.table.jsx";
import GenericTableContainer from "../../shared/generic/generic.table.container.jsx";

const ClientLeagueTable = () => {
    // Use the base table with correct URL prefix for client
    const baseTableProps = BaseLeagueTable({
        urlPrefix: '/leagues/',
    });

    return (
        <GenericTableContainer
            tableProps={baseTableProps.tableProps}
            title="League Table"
        />
    );
};

export default ClientLeagueTable;