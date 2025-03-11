// epl-web/src/components/admin/league-season/match/match.table.jsx
import { Table, Button, Space, Tag } from "antd";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchMatchesBySeasonAPI } from "../../../../services/api.service.js";

const MatchTable = ({ leagueSeason }) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadMatches = async () => {
        setLoading(true);
        try {
            const res = await fetchMatchesBySeasonAPI(leagueSeason.id);
            if (res.data) {
                setMatches(res.data);
            }
        } catch (error) {
            console.error("Error loading matches:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMatches();
    }, [leagueSeason]);

    const formatDateTime = (dateTime) => {
        if (!dateTime) return "-";
        const date = new Date(dateTime);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const columns = [
        {
            title: "Round",
            dataIndex: "round",
            key: "round",
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (date) => formatDateTime(date),
        },
        {
            title: "Home",
            dataIndex: "host",
            key: "host",
            render: (host) => host?.name,
        },
        {
            title: "Score",
            key: "score",
            render: (_, record) => {
                if (record.hostScore !== undefined && record.awayScore !== undefined) {
                    return `${record.hostScore} - ${record.awayScore}`;
                }
                return "TBD";
            },
        },
        {
            title: "Away",
            dataIndex: "away",
            key: "away",
            render: (away) => away?.name,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space size="small">
                    <Link to={`/admin/match-actions/${record.id}`}>
                        <Button size="small" type="primary">
                            Actions
                        </Button>
                    </Link>
                    <EditMatchButton match={record} onSuccess={loadMatches} />
                    <DeleteMatchButton match={record} onSuccess={loadMatches} />
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <h3>Matches</h3>
                {/*<CreateMatchButton leagueSeason={leagueSeason} onSuccess={loadMatches} />*/}
            </div>
            <Table
                columns={columns}
                dataSource={matches}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 15 }}
                bordered
            />
        </div>
    );
};

export default MatchTable;