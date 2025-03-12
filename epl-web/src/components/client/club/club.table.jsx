import GenericTableContainer from "../../shared/generic/generic.table.container.jsx";
import BaseClubTable from "../../shared/club/base.club.table.jsx";

const ClientClubTable = () => {
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