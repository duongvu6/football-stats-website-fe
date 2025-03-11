// epl-web/src/components/admin/league-season/club-season/club.season.table.jsx
import { Table, Button, Space } from "antd";
import { useState } from "react";
import AddClubToSeasonButton from "./add.club-to-season.button.jsx";
import EditClubSeasonModal from "./edit.club-season.modal.jsx";
import DeleteClubSeasonButton from "./delete.club-season.button.jsx";

const ClubSeasonTable = ({ leagueSeason }) => {
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [currentClubSeason, setCurrentClubSeason] = useState(null);

    // Use clubSeasonTables directly from the leagueSeason object
    const clubSeasons = leagueSeason?.clubSeasonTables || [];

    const handleUpdateClubSeason = (clubSeason) => {
        setCurrentClubSeason(clubSeason);
        setEditModalVisible(true);
    };

    // This refresh function will be called after mutations
    const onSuccess = () => {
        if (leagueSeason.onRefresh) {
            leagueSeason.onRefresh();
        }
    };

    const columns = [
        {
            title: "Position",
            dataIndex: "ranked",
            key: "ranked",
            sorter: (a, b) => a.ranked - b.ranked,
        },
        {
            title: "Club",
            dataIndex: "club",
            key: "club",
            render: (club) => club?.name,
        },
        {
            title: "MP",
            key: "mp",
            render: (_, record) => record.numWins + record.numDraws + record.numLosses,
        },
        {
            title: "W",
            dataIndex: "numWins",
            key: "numWins",
        },
        {
            title: "D",
            dataIndex: "numDraws",
            key: "numDraws",
        },
        {
            title: "L",
            dataIndex: "numLosses",
            key: "numLosses",
        },
        {
            title: "GF",
            dataIndex: "goalScores",
            key: "goalScores",
        },
        {
            title: "GA",
            dataIndex: "goalConceded",
            key: "goalConceded",
        },
        {
            title: "GD",
            dataIndex: "diff",
            key: "diff",
        },
        {
            title: "Pts",
            dataIndex: "points",
            key: "points",
            sorter: (a, b) => b.points - a.points,
            defaultSortOrder: 'descend'
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space size="small">
                    <Button
                        size="small"
                        type="primary"
                        onClick={() => handleUpdateClubSeason(record)}
                    >
                        Edit
                    </Button>
                    <DeleteClubSeasonButton
                        clubSeason={record}
                        onSuccess={onSuccess}
                    />
                </Space>
            ),
        }
    ];

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <h3>League Table</h3>
                <AddClubToSeasonButton leagueSeason={leagueSeason} onSuccess={onSuccess} />
            </div>
            <Table
                columns={columns}
                dataSource={clubSeasons}
                rowKey="id"
                loading={false}
                pagination={false}
                bordered
                scroll={{ x: 'max-content' }}
            />

            <EditClubSeasonModal
                clubSeason={currentClubSeason}
                isOpen={editModalVisible}
                setIsOpen={setEditModalVisible}
                onSuccess={onSuccess}
            />
        </div>
    );
};

export default ClubSeasonTable;