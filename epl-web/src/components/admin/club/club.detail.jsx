import {useEffect, useState} from "react";
import {Button, Card, Col, Descriptions, Image, Modal, notification, Row, Space, Spin} from "antd";
import {fetchClubDetailAPI} from "../../../services/api.service.js";
import {Link, useParams} from "react-router-dom";
import {EditOutlined, UploadOutlined} from "@ant-design/icons";
import ImageUploader from "../../common/ImageUploader.jsx";

const AdminClubDetail = () => {
    const {id} = useParams();
    const [club, setClub] = useState(null);;
    const [loading, setLoading] = useState(true);
    const [isImageUploaderVisible, setIsImageUploaderVisible] = useState(false);

    useEffect(() => {
        loadClubDetail();
    }, [id]);
    const handleImageUploadComplete = () => {
        setIsImageUploaderVisible(false);
        loadClubDetail(); // Reload club data to get the updated image
    };
    const loadClubDetail = async () => {
        setLoading(true);
        try {
            const response = await fetchClubDetailAPI(id);
            if (response.data) {
                setClub(response.data);
            }
        } catch(error) {
            notification.error({
                message: "Error loading club detail",
                description: error.message
            })
        } finally {
            setLoading(false);
        }
    }
    if (loading || !club) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }
    return (
        <div style={{ padding: "30px" }}>
            <Card
                title="Club Information"
                extra={
                    <Space>
                        <Button
                            type="primary"
                            icon={<UploadOutlined />}
                            onClick={() => setIsImageUploaderVisible(true)}
                        >
                            Upload Logo
                        </Button>
                        <Link to={`/admin/clubs/${id}/edit`}>
                            <Button type="primary" icon={<EditOutlined />}>
                                Edit
                            </Button>
                        </Link>
                    </Space>
                }
            >
                <Row gutter={24}>
                    <Col span={8} style={{ textAlign: 'center' }}>
                        <Image
                            src={club.imageUrl}
                            alt={club.name}
                            style={{ maxWidth: '200px', maxHeight: '200px' }}
                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCY"
                        />
                    </Col>
                    <Col span={16}>
                        <Descriptions bordered>
                            <Descriptions.Item label="ID" span={3}>{club.id}</Descriptions.Item>
                            <Descriptions.Item label="Name" span={3}>{club.name}</Descriptions.Item>
                            <Descriptions.Item label="Country" span={3}>{club.country}</Descriptions.Item>
                            <Descriptions.Item label="Stadium Name" span={3}>{club.stadiumName || 'N/A'}</Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
            </Card>

            {/* Image uploader modal */}
            {isImageUploaderVisible && (
                <Modal
                    title="Upload Club Logo"
                    visible={isImageUploaderVisible}
                    onCancel={() => setIsImageUploaderVisible(false)}
                    footer={null}
                >
                    <ImageUploader
                        entityType="club"
                        initialImageUrl={club.imageUrl}
                        onImageUpload={handleImageUploadComplete}
                    />
                </Modal>
            )}
        </div>
    );

};
export default AdminClubDetail;