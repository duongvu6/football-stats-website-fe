// epl-web/src/components/admin/match/match.actions.jsx
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Table, Card, Row, Col, Typography, Spin, Space } from "antd";
import CreateMatchActionButton from "./create.match-action.button.jsx";
import {fetchMatchActionsAPI, fetchMatchDetailAPI} from "../../../../services/api.service.js";


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
            if (actionsRes.data) {
                setMatchActions(actionsRes.data);
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
                if (action === "YELLOW_CARD") color = "orange";
                if (action === "RED_CARD") color = "red";
                if (action === "OWN_GOAL") color = "purple";
                if (action === "SUBSTITUTION") color = "cyan";

                return <Tag color={color}>{action}</Tag>;
            },
        },
        {
            title: "Player",
            dataIndex: "player",
            key: "player",
            render: (player) => player?.name,
        },
        {
            title: "Team",
            key: "team",
            render: (_, record) => {
                const isHomeTeam = record.player?.club?.id === match.host.id;
                return isHomeTeam ? match.host.name : match.away.name;
            },
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space size="small">
                    <EditMatchActionButton
                        matchAction={record}
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