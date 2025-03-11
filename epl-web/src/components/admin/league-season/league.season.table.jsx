// epl-web/src/components/admin/league-season/league.season.table.jsx
import { Table, Space } from "antd";
import EditLeagueSeasonButton from "./edit.league-season.button.jsx";
import DeleteLeagueSeasonButton from "./delete.league-season.button.jsx";

const LeagueSeasonTable = ({
                               seasonColumns,
                               leagueSeasons,
                               league,
                               onSuccess,
                               isAdmin = false
                           }) => {
    // Add actions column for admin view
    const columns = isAdmin
        ? [
            ...seasonColumns,
            {
                title: "Actions",
                key: "actions",
                render: (_, record) => (
                    <Space size="small">
                        <EditLeagueSeasonButton
                            league={league}
                            leagueSeason={record}
                            onSuccess={onSuccess}
                        />
                        <DeleteLeagueSeasonButton
                            league={league}
                            leagueSeason={record}
                            onSuccess={onSuccess}
                        />
                    </Space>
                ),
            }
        ]
        : seasonColumns;

    return (
        <Table
            columns={columns}
            dataSource={leagueSeasons}
            rowKey="id"
            pagination={false}
        />
    );
};

export default LeagueSeasonTable;