// epl-web/src/components/admin/coach/coach.detail.jsx
import {useParams} from "react-router-dom";
import BaseCoachDetail from "../../shared/coach/base.coach.detail.jsx";
import {Descriptions, Spin} from "antd";
import CreateCoachClubButton from "../coach-club/create.coach-club.button.jsx"; // Fixed path
import CoachClubHistoryTable from "../coach-club/coach-club.history.table.jsx"; // Fixed path

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
                    <CreateCoachClubButton coach={coach} onSuccess={loadCoachDetail}/>
                </div>
                <CoachClubHistoryTable
                    coachClubColumns={transferColumns}
                    coachClubs={coachClubs}
                    coach={coach}
                    onSuccess={loadCoachDetail}
                    isAdmin={true}
                />
            </div>
        </div>
    );
};

export default AdminCoachDetail;