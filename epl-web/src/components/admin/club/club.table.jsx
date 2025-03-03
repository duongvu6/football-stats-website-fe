// epl-web/src/components/admin/club/club.table.jsx
import BaseClubTable from "../../shared/club/base.club.table";
import GenericTableContainer from "../../shared/generic/generic.table.container.jsx";

const AdminClubTable = () => {
    const adminColumns = [
        {
            title: "ID",
            dataIndex: "id",
        }
    ];

    const baseTableProps = BaseClubTable({
        extraColumns: adminColumns,
        urlPrefix: '/admin/clubs/',
    });

    return (
        <GenericTableContainer
            tableProps={baseTableProps.tableProps}
            title="Club Table"
        />
    );
};

export default AdminClubTable;