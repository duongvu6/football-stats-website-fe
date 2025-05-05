
import { Table, Button, Space, Tag, Tabs } from "antd";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchMatchesBySeasonAPI } from "../../../../services/api.service.js";
import CreateMatchButton from "./create.match.button.jsx";
import EditMatchButton from "./edit.match.button.jsx";
import DeleteMatchButton from "./delete.match.button.jsx";

const MatchTable = ({ leagueSeason }) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roundGroups, setRoundGroups] = useState({});

    const loadMatches = async () => {
        setLoading(true);
        try {
            const res = await fetchMatchesBySeasonAPI(leagueSeason.id);
            if (res.data) {
                const matchData = res.data.result;
                setMatches(matchData);

                const groups = {};
                matchData.forEach(match => {
                    const round = match.round || 1;
                    if (!groups[round]) {
                        groups[round] = [];
                    }
                    groups[round].push(match);
                });
                setRoundGroups(groups);
            }
        } catch (error) {
            console.error("Error loading matches:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (leagueSeason && leagueSeason.id) {
            loadMatches();
        }
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
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (date) => formatDateTime(date),
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
        },
        {
            title: "Home",
            dataIndex: "host",
            key: "host",
            render: (host) => host?.name,
            sorter: (a, b) => a.host?.name.localeCompare(b.host?.name),
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
            sorter: (a, b) => {
                const aScore = a.hostScore - a.awayScore;
                const bScore = b.hostScore - b.awayScore;
                return aScore - bScore;
            },
        },
        {
            title: "Away",
            dataIndex: "away",
            key: "away",
            render: (away) => away?.name,
            sorter: (a, b) => a.away?.name.localeCompare(b.away?.name),
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

    if (loading) {
        return <div>Loading matches...</div>;
    }

    const roundTabs = Object.keys(roundGroups).sort((a, b) => Number(a) - Number(b)).map(round => ({
        key: round,
        label: `Round ${round}`,
        children: (
            <Table
                columns={columns}
                dataSource={roundGroups[round]}
                rowKey="id"
                pagination={false}
                bordered
            />
        )
    }));

    return (
        <div>
            <div style={{display: "flex", justifyContent: "space-between", marginBottom: "16px"}}>
                <h3>Matches</h3>
                <CreateMatchButton
                    leagueSeason={leagueSeason}
                    onSuccess={loadMatches} // Make sure this is correctly passed
                />
            </div>

            {roundTabs.length > 0 ? (
                <Tabs defaultActiveKey="1" items={roundTabs}/>
            ) : (
                <div style={{textAlign: "center", padding: "20px"}}>
                    No matches available. Add the first match using the button above.
                </div>
            )}
        </div>
    );
};

export default MatchTable;