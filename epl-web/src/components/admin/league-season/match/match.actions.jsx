
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Table, Card, Row, Col, Typography, Spin, Space, Tag } from "antd";
import { fetchMatchActionsAPI, fetchMatchDetailAPI } from "../../../../services/api.service.js";
import CreateMatchActionButton from "./create.match-action.button.jsx";
import EditMatchActionButton from "./edit.match-action.button.jsx";
import DeleteMatchActionButton from "./delete.match-action.button.jsx";

const { Title, Text } = Typography;

const MatchActionPage = () => {
    const { id } = useParams();
    const [match, setMatch] = useState(null);
    const [matchActions, setMatchActions] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadMatchDetail = async () => {
        setLoading(true);
        try {
            const matchRes = await fetchMatchDetailAPI(id);
            if (matchRes.data) {
                setMatch(matchRes.data);
            }

            const actionsRes = await fetchMatchActionsAPI(id);

            if (actionsRes.data && actionsRes.data.result) {
                setMatchActions(actionsRes.data.result);
            } else if (Array.isArray(actionsRes.data)) {
                setMatchActions(actionsRes.data);
            } else {
                setMatchActions([]);
            }
        } catch (error) {
            console.error("Error loading match details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMatchDetail();
    }, [id]);

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin />
            </div>
        );
    }

    if (!match) {
        return <div>Match not found</div>;
    }

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

    const determinePlayerTeam = (player) => {
        if (!player) return "Unknown";

        const hostClubId = match.host.id;
        const hostClubName = match.host.name;
        const awayClubId = match.away.id;
        const awayClubName = match.away.name;

        if (player.club) {
            if (typeof player.club === 'object') {

                if (player.club.id === hostClubId) return hostClubName;
                if (player.club.id === awayClubId) return awayClubName;

                if (player.club.name === hostClubName) return hostClubName;
                if (player.club.name === awayClubName) return awayClubName;

                return player.club.name;
            } else if (typeof player.club === 'string') {

                if (player.club === hostClubName || player.club.includes(hostClubName) || hostClubName.includes(player.club)) {
                    return hostClubName;
                }
                if (player.club === awayClubName || player.club.includes(awayClubName) || awayClubName.includes(player.club)) {
                    return awayClubName;
                }
                return player.club;
            }
        }

        if (player.transferHistories && player.transferHistories.length > 0) {
            const latestTransfer = player.transferHistories[0];
            if (latestTransfer.club) {
                if (typeof latestTransfer.club === 'object') {

                    if (latestTransfer.club.id === hostClubId) return hostClubName;
                    if (latestTransfer.club.id === awayClubId) return awayClubName;

                    if (latestTransfer.club.name === hostClubName) return hostClubName;
                    if (latestTransfer.club.name === awayClubName) return awayClubName;

                    return latestTransfer.club.name;
                } else if (typeof latestTransfer.club === 'string') {

                    if (latestTransfer.club === hostClubName ||
                        latestTransfer.club.includes(hostClubName) ||
                        hostClubName.includes(latestTransfer.club)) {
                        return hostClubName;
                    }
                    if (latestTransfer.club === awayClubName ||
                        latestTransfer.club.includes(awayClubName) ||
                        awayClubName.includes(latestTransfer.club)) {
                        return awayClubName;
                    }
                    return latestTransfer.club;
                }
            }
        }

        return "Unknown Team";
    };

    const columns = [
        {
            title: "Minute",
            dataIndex: "minute",
            key: "minute",
            sorter: (a, b) => a.minute - b.minute,
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (action) => {
                let color = "blue";
                if (action === "GOAL") color = "green";
                if (action === "ASSIST") color = "blue";
                if (action === "YELLOW_CARD") color = "orange";
                if (action === "RED_CARD") color = "red";
                if (action === "OWN_GOAL") color = "purple";

                const displayAction = action.replace(/_/g, ' ').toLowerCase()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                return <Tag color={color}>{displayAction}</Tag>;
            },
            filters: [
                { text: 'Goal', value: 'GOAL' },
                { text: 'Assist', value: 'ASSIST' },
                { text: 'Own Goal', value: 'OWN_GOAL' },
                { text: 'Yellow Card', value: 'YELLOW_CARD' },
                { text: 'Red Card', value: 'RED_CARD' },
            ],
            onFilter: (value, record) => record.action === value,
        },
        {
            title: "Player",
            dataIndex: "player",
            key: "player",
            render: (player) => player?.name,
            sorter: (a, b) => (a.player?.name || '').localeCompare(b.player?.name || '')
        },
        {
            title: "Team",
            key: "team",
            render: (_, record) => determinePlayerTeam(record.player),
            sorter: (a, b) => {
                const teamA = determinePlayerTeam(a.player);
                const teamB = determinePlayerTeam(b.player);
                return teamA.localeCompare(teamB);
            },
            filters: [
                { text: match?.host?.name || 'Home', value: match?.host?.name || 'Home' },
                { text: match?.away?.name || 'Away', value: match?.away?.name || 'Away' }
            ],
            onFilter: (value, record) => determinePlayerTeam(record.player) === value,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space size="small">
                    <EditMatchActionButton
                        matchAction={record}
                        match={match}
                        onSuccess={loadMatchDetail}
                    />
                    <DeleteMatchActionButton
                        matchAction={record}
                        onSuccess={loadMatchDetail}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: "30px" }}>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card>
                        <Title level={3}>Match Details</Title>
                        <Row>
                            <Col span={8}>
                                <Text strong>Round:</Text> {match.round}
                            </Col>
                            <Col span={8}>
                                <Text strong>Date:</Text> {formatDateTime(match.date)}
                            </Col>
                            <Col span={8}>
                                <Text strong>Season:</Text> {match.season.name}
                            </Col>
                        </Row>
                        <Row style={{ marginTop: "16px" }}>
                            <Col span={10} style={{ textAlign: "right" }}>
                                <Title level={4}>{match.host.name}</Title>
                            </Col>
                            <Col span={4} style={{ textAlign: "center" }}>
                                <Title level={3}>{match.hostScore} - {match.awayScore}</Title>
                            </Col>
                            <Col span={10}>
                                <Title level={4}>{match.away.name}</Title>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col span={24}>
                    <Card>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                            <Title level={4} style={{ margin: 0 }}>Match Actions</Title>
                            <CreateMatchActionButton match={match} onSuccess={loadMatchDetail} />
                        </div>
                        <Table
                            columns={columns}
                            dataSource={matchActions}
                            rowKey="id"
                            pagination={false}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default MatchActionPage;