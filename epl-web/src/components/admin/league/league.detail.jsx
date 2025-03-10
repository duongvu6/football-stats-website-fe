// epl-web/src/pages/admin/league.detail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Col, Row, Typography, Spin, Button, Modal, Form, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import {fetchLeagueDetailAPI} from "../../../services/api.service.js";
import EditLeagueModal from "./league.edit.jsx";

const { Title, Text } = Typography;

const AdminLeagueDetailPage = () => {
    const [league, setLeague] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { id } = useParams();
    const [form] = Form.useForm();

    const fetchLeagueDetail = async () => {
        try {
            setLoading(true);
            const res = await fetchLeagueDetailAPI(id);
            setLeague(res.data);
        } catch (error) {
            console.error("Failed to fetch league details:", error);
            message.error("Failed to load league details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeagueDetail();
    }, [id]);

    const handleEditSuccess = () => {
        fetchLeagueDetail();
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!league) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Title level={3}>League not found</Title>
            </div>
        );
    }

    return (
        <div style={{ padding: "30px" }}>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card
                        title={<Title level={2}>{league.name}</Title>}
                        extra={
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => setIsEditModalOpen(true)}
                            >
                                Edit
                            </Button>
                        }
                    >
                        <div>
                            <Text strong>League ID: </Text>
                            <Text>{league.id}</Text>
                        </div>

                        {/* You can add more league details here as needed */}
                    </Card>
                </Col>
            </Row>

            <EditLeagueModal
                isOpen={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onSuccess={handleEditSuccess}
                league={league}
            />
        </div>
    );
};

export default AdminLeagueDetailPage;