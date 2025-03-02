// epl-web/src/components/client/player/player.table.jsx
import { Table } from "antd";
import PlayerBaseTable from "../../shared/player/base.player.table.jsx";

const ClientPlayerTable = () => {
    // Use the base table with correct URL prefix for client
    const baseTableProps = PlayerBaseTable({
        urlPrefix: '/players/',  // Note the trailing slash
    });

    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
                marginBottom: "10px"
            }}>
                <h3>Player Table</h3>
            </div>
            <Table {...baseTableProps.tableProps} />
        </>
    )
}

export default ClientPlayerTable;