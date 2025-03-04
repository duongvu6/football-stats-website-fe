import BaseCoachTable from "../../shared/coach/base.coach.table";
import GenericTableContainer from "../../shared/generic/generic.table.container";

const AdminCoachTable = () => {
    const adminColumns = [
        {
            title: "ID",
            dataIndex: "id",
        }
    ];
    const baseTableProps = BaseCoachTable({
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
export default AdminCoachTable;