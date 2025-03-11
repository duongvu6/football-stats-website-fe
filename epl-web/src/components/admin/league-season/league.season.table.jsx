// epl-web/src/components/admin/league-season/league.season.table.jsx
import { Table, Space } from "antd";
import { Link } from "react-router-dom";
import EditLeagueSeasonButton from "./edit.league-season.button.jsx";
import DeleteLeagueSeasonButton from "./delete.league-season.button.jsx";

const LeagueSeasonTable = ({
                               seasonColumns,
                               leagueSeasons,
                               league,
                               onSuccess,
                               isAdmin = false
                           }) => {
    // Modify the name column to include a link
    const columnsWithLinks = seasonColumns.map(column => {
        if (column.key === "name") {
            return {
                ...column,
                render: (text, record) => (
                    <Link to={`/admin/league-seasons/${record.id}`}>
                        {text}
                    </Link>
                )
            };
        }
        return column;
    });

    // Add actions column for admin view
    const columns = isAdmin
        ? [
            ...columnsWithLinks,
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
        : columnsWithLinks;

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