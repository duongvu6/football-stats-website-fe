import {useParams} from "react-router-dom";
import {Descriptions, Spin} from "antd";
import BaseCoachDetail from "../../shared/coach/base.coach.detail.jsx";

const ClientCoachDetail = () => {
    const { id } = useParams();

    const {
        loading,
        coach,
        coachClubs,
        descriptionItems,
        transferColumns
    } = BaseCoachDetail({
        coachId: id
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
                {/*<TransferHistoryTable*/}
                {/*    transferColumns={transferColumns}*/}
                {/*    transferHistories={transferHistories}*/}
                {/*    isAdmin={false} // No admin actions for client view*/}
                {/*/>*/}
            </div>
        </div>
    );
};

export default ClientCoachDetail;