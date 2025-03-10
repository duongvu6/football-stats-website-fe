import BaseCoachTable from "../../shared/coach/base.coach.table.jsx";
import GenericTableContainer from "../../shared/generic/generic.table.container.jsx";
import BaseClubTable from "../../shared/club/base.club.table.jsx";

const ClientClubTable = () => {
    // Use the base table with correct URL prefix for client
    const baseTableProps = BaseClubTable({
        urlPrefix: '/clubs/',
    });

    return (
        <GenericTableContainer
            tableProps={baseTableProps.tableProps}
            title="Club Table"
        />
    );
};

export default ClientClubTable;