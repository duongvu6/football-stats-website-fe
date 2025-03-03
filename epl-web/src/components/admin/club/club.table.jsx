import { Table } from "antd";
import BaseClubTable from "../../shared/club/base.club.table";

const AdminClubTable = () => {
    const adminColumns = [
        {
            title: "ID",
            dataIndex: "id",
        }
    ];
    const baseTableProps = BaseClubTable({
        extraColumns: adminColumns,
        urlPrefix: '/admin/clubs/',  // Note the trailing slash to ensure proper URL formatting
    });
    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "10px",
                marginBottom: "10px"
            }}>
                <h3>Club Table</h3>
                
            </div>

            <Table {...baseTableProps.tableProps} />

            
        </>
    )
};
export default AdminClubTable;