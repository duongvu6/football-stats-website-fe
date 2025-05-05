
import { Table, Space } from "antd";
import EditCoachClubButton from "./edit.coach-club.button.jsx";
import DeleteCoachClubButton from "./delete.coach-club.button.jsx";

const CoachClubHistoryTable = ({ coachClubColumns, coachClubs, coach, onSuccess, isAdmin = false }) => {

    const columns = isAdmin
        ? [
            ...coachClubColumns,
            {
                title: "Actions",
                key: "actions",
                render: (_, record) => (
                    <Space size="small">
                        <EditCoachClubButton
                            coach={coach}
                            coachClub={record}
                            onSuccess={onSuccess}
                        />
                        <DeleteCoachClubButton
                            coachClub={record}
                            onSuccess={onSuccess}
                        />
                    </Space>
                ),
            }
        ]
        : coachClubColumns;

    return (
        <Table
            columns={columns}
            dataSource={coachClubs}
            rowKey="startDate"
            pagination={false}
        />
    );
};

export default CoachClubHistoryTable;