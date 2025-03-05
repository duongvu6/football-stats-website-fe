// epl-web/src/components/client/player/player.table.jsx
import GenericTableContainer from "../../shared/generic/generic.table.container.jsx";
import BaseCoachTable from "../../shared/coach/base.coach.table.jsx";

const ClientCoachTable = () => {
    // Use the base table with correct URL prefix for client
    const baseTableProps = BaseCoachTable({
        urlPrefix: '/coaches/',
    });

    return (
        <GenericTableContainer
            tableProps={baseTableProps.tableProps}
            title="Head Coach Table"
        />
    );
};

export default ClientCoachTable;