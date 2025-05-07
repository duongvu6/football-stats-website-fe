
import { useEffect, useState } from "react";
import {Descriptions, Spin, Tag, Table, Card, Row, Col, Image} from "antd";
import { useParams, Link } from "react-router-dom";
import { fetchCoachDetailAPI } from "../../../services/api.service.js";

const ClientCoachDetail = () => {
    const { id } = useParams();
    const [coach, setCoach] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCoachDetail();
    }, [id]);

    const loadCoachDetail = async () => {
        setLoading(true);
        try {
            const response = await fetchCoachDetailAPI(id);
            if (response.data) {
                setCoach(response.data);
            }
        } catch (error) {
            console.error("Error loading coach detail:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const makeCitizenshipLinks = (citizenships) => {
        if (!citizenships) return "-";
        if (!Array.isArray(citizenships)) citizenships = [citizenships];

        return citizenships.map((country, index) => (
            <Tag key={index} color="green" style={{marginRight: "5px"}}>
                <Link to={`/coaches?citizenship=${encodeURIComponent(country)}`}>{country}</Link>
            </Tag>
        ));
    };

    const getCurrentClub = () => {
        if (!coach.coachClubs || coach.coachClubs.length === 0) return "No club";

        const currentClub = coach.coachClubs[0]; // Most recent club entry
        if (!currentClub) return "No club";

        if (typeof currentClub.club === 'object' && currentClub.club) {
            return (
                <Link to={`/coaches?club=${currentClub.club.id}`}>
                    {currentClub.club.name}
                </Link>
            );
        }

        return currentClub.club || "No club";
    };

    if (loading || !coach) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    const clubHistoryColumns = [
        {
            title: "Start Date",
            dataIndex: "startDate",
            key: "startDate",
            render: date => formatDate(date)
        },
        {
            title: "End Date",
            dataIndex: "endDate",
            key: "endDate",
            render: date => date ? formatDate(date) : "Present"
        },
        {
            title: "Club",
            key: "club",
            render: (_, record) => {
                if (typeof record.club === 'object' && record.club) {
                    return (
                        <Link to={`/coaches?club=${record.club.id}`}>
                            {record.club.name}
                        </Link>
                    );
                }
                return record.club || "-";
            }
        }
    ];

    return (
        <div style={{ padding: "30px" }}>
            <Card>
                <Row gutter={24}>
                    <Col span={6} style={{ textAlign: 'center' }}>
                        <Image
                            src={coach.imageUrl}
                            alt={coach.name}
                            style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }}
                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCY"
                        />
                    </Col>
                    <Col span={18}>
                        <Descriptions title="Coach Details" bordered>
                            <Descriptions.Item label="Name">{coach.name}</Descriptions.Item>
                            <Descriptions.Item label="Age">{coach.age}</Descriptions.Item>
                            <Descriptions.Item label="Date of Birth">{formatDate(coach.dob)}</Descriptions.Item>
                            <Descriptions.Item label="Citizenship">
                                {makeCitizenshipLinks(coach.citizenships)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Current Club">
                                {getCurrentClub()}
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
            </Card>

            {/* Coach Club History using Ant Design Table */}
            <div style={{ marginTop: "30px" }}>
                <h3>Club History</h3>
                <Table
                    columns={clubHistoryColumns}
                    dataSource={coach.coachClubs || []}
                    rowKey={(record) => record.id || `${record.startDate}-${record.type}`}
                    pagination={false}
                    locale={{
                        emptyText: "No club history available"
                    }}
                />
            </div>
        </div>
    );
};

export default ClientCoachDetail;