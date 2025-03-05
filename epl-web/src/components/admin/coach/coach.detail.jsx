import {useParams} from "react-router-dom";
import BasePlayerDetail from "../../shared/player/base.player.detail.jsx";
import {Descriptions, Spin} from "antd";
import CreateTransferButton from "../transfer-history/create.transfer.button.jsx";
import TransferHistoryTable from "../transfer-history/transfer.history.table.jsx";
import BaseCoachDetail from "../../shared/coach/base.coach.detail.jsx";

const AdminCoachDetail = () => {
    const { id } = useParams();

    const {
        loading,
        coach,
        coachClubs,
        descriptionItems,
        transferColumns,
        loadCoachDetail
    } = BaseCoachDetail({
        coachId: id,
        extraDescriptionItems: [
            { label: "ID", value: coach => coach?.id }
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
            <Descriptions title="Head Coach Details" bordered>
                {descriptionItems.map((item, index) => (
                    <Descriptions.Item key={index} label={item.label}>{item.value}</Descriptions.Item>
                ))}
            </Descriptions>
            <div style={{ marginTop: "30px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ margin: 0 }}>Clubs History</h3>
                    <CreateTransferButton coach={coach} onSuccess={loadCoachDetail}/>
                </div>

            </div>
        </div>
    );
};

export default AdminCoachDetail;