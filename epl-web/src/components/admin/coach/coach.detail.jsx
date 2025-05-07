
import { useEffect, useState } from "react";
import {Button, Card, Col, Descriptions, Image, Row, Space, Spin} from "antd";
import {Link, useParams} from "react-router-dom";
import { fetchCoachDetailAPI } from "../../../services/api.service.js";
import CoachClubHistoryTable from "../coach-club/coach-club.history.table.jsx";
import CreateCoachClubButton from "../coach-club/create.coach-club.button.jsx";
import {EditOutlined, UploadOutlined} from "@ant-design/icons";

const AdminCoachDetail = () => {
    const { id } = useParams();
    const [coach, setCoach] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isImageUploaderVisible, setIsImageUploaderVisible] = useState(false);
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

    if (loading || !coach) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    const coachClubColumns = [
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
                    return record.club.name;
                }
                return record.club || "-";
            }
        }
    ];

    return (
        <div style={{ padding: "30px" }}>
            <Card
                title="Coach Information"
            >
                <Row gutter={24}>
                    <Col span={8} style={{ textAlign: 'center' }}>
                        <Image
                            src={coach.imageUrl}
                            alt={coach.name}
                            style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }}
                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCY"
                        />
                    </Col>
                    <Col span={16}>
                        <Descriptions bordered>
                            <Descriptions.Item label="ID" span={3}>{coach.id}</Descriptions.Item>
                            <Descriptions.Item label="Name" span={3}>{coach.name}</Descriptions.Item>
                            <Descriptions.Item label="Age" span={3}>{coach.age}</Descriptions.Item>
                            <Descriptions.Item label="Date of Birth" span={3}>{formatDate(coach.dob)}</Descriptions.Item>
                            <Descriptions.Item label="Citizenship" span={3}>
                                {Array.isArray(coach.citizenships) ? coach.citizenships.join(', ') : coach.citizenships}
                            </Descriptions.Item>
                            <Descriptions.Item label="Current Club" span={3}>
                                {coach.coachClubs && coach.coachClubs.length > 0 ?
                                    (typeof coach.coachClubs[0].club === 'object' ?
                                        coach.coachClubs[0].club.name : coach.coachClubs[0].club) :
                                    "No club"}
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
            </Card>

            <div style={{ marginTop: "30px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ margin: 0 }}>Clubs History</h3>
                    <CreateCoachClubButton coach={coach} onSuccess={loadCoachDetail}/>
                </div>

                <CoachClubHistoryTable
                    coachClubColumns={coachClubColumns}
                    coachClubs={coach.coachClubs || []}
                    coach={coach}
                    onSuccess={loadCoachDetail}
                    isAdmin={true}
                />
            </div>
        </div>
    );
};

export default AdminCoachDetail;