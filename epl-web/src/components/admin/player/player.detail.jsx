import { useEffect, useState } from "react";
import { Descriptions, Spin } from "antd";
import { useParams } from "react-router-dom";
import { fetchPlayerDetailAPI } from "../../../services/api.service.js";
import TransferHistoryTable from "../transfer-history/transfer.history.table.jsx";
import CreateTransferButton from "../transfer-history/create.transfer.button.jsx";
import { Row, Col, Image } from 'antd';
const AdminPlayerDetail = () => {
    const { id } = useParams(); // Get player ID from URL
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPlayerDetail();
    }, [id]);

    const loadPlayerDetail = async () => {
        setLoading(true);
        try {
            const response = await fetchPlayerDetailAPI(id);
            if (response.data) {
                setPlayer(response.data);
            }
        } catch (error) {
            console.error("Error loading player detail:", error);
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

    if (loading || !player) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    const descriptionItems = [
        { label: "ID", value: player.id },
        { label: "Name", value: player.name },
        { label: "Age", value: player.age },
        { label: "Date of Birth", value: formatDate(player.dob) },
        { label: "Shirt Number", value: player.shirtNumber },
        { label: "Citizenship", value: Array.isArray(player.citizenships) ? player.citizenships.join(', ') : player.citizenships },
        { label: "Position", value: Array.isArray(player.positions) ? player.positions.join(', ') : player.positions },
        { label: "Current Club", value: player.currentClub || "No club" },
        { label: "Market Value (millions Euro)", value: player.marketValue }
    ];

    return (
        <div style={{ padding: "30px" }}>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={6}>
                    <Image
                        src={player.imageUrl}
                        alt={player.name}
                        style={{ width: '100%', maxWidth: '300px', borderRadius: '8px', marginBottom: '20px' }}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCY"
                    />
                </Col>
                <Col xs={24} md={18}>
                    <Descriptions title="Player Details" bordered>
                        {descriptionItems.map((item, index) => (
                            <Descriptions.Item key={index} label={item.label}>{item.value}</Descriptions.Item>
                        ))}
                    </Descriptions>
                </Col>
            </Row>

            <div style={{ marginTop: "30px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ margin: 0 }}>Transfer History</h3>
                    <CreateTransferButton player={player} onSuccess={loadPlayerDetail} />
                </div>

                <TransferHistoryTable
                    player={player}
                    transferHistories={player.transferHistories || []}
                    onSuccess={loadPlayerDetail}
                    isAdmin={true}
                />
            </div>
        </div>
    );
};

export default AdminPlayerDetail;