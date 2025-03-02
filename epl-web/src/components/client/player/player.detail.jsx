// epl-web/src/components/client/player/player.detail.jsx
import { Descriptions, Table, Spin } from "antd";
import { useParams } from "react-router-dom";
import PlayerBaseDetail from "../../shared/player/base.player.detail.jsx";
import TransferHistoryTable from "../../admin/transfer-history/transfer.history.table.jsx";

const ClientPlayerDetail = () => {
    const { id } = useParams();

    const {
        loading,
        player,
        transferHistories,
        descriptionItems,
        transferColumns
    } = PlayerBaseDetail({
        playerId: id
    });

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin />
            </div>
        );
    }

    return (
        <div style={{ padding: "30px" }}>
            <Descriptions title="Player Details" bordered>
                {descriptionItems.map((item, index) => (
                    <Descriptions.Item key={index} label={item.label}>{item.value}</Descriptions.Item>
                ))}
            </Descriptions>
            <div style={{ marginTop: "30px" }}>
                <h3>Transfer History</h3>
                <TransferHistoryTable
                    transferColumns={transferColumns}
                    transferHistories={transferHistories}
                />
            </div>
        </div>
    );
};

export default ClientPlayerDetail;