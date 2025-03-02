// epl-web/src/components/admin/player/player.detail.jsx
import { Descriptions, Spin } from "antd";
import { useParams } from "react-router-dom";
import PlayerBaseDetail from "../../shared/player/base.player.detail.jsx";
import TransferHistoryTable from "../transfer-history/transfer.history.table.jsx";
import CreateTransferButton from "../transfer-history/create.transfer.button.jsx";

const PlayerDetail = () => {
    const { id } = useParams();

    const {
        loading,
        player,
        transferHistories,
        descriptionItems,
        transferColumns,
        loadPlayerDetail
    } = PlayerBaseDetail({
        playerId: id,
        extraDescriptionItems: [
            { label: "ID", value: player => player?.id }
        ]
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ margin: 0 }}>Transfer History</h3>
                    <CreateTransferButton player={player} onSuccess={loadPlayerDetail}/>
                </div>
                <TransferHistoryTable
                    transferColumns={transferColumns}
                    transferHistories={transferHistories}
                    player={player}
                    onSuccess={loadPlayerDetail}
                    isAdmin={true}
                />
            </div>
        </div>
    );
};

export default PlayerDetail;