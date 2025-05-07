
import { useEffect, useState } from "react";
import { Descriptions, Spin, Tag } from "antd";
import { useParams, Link } from "react-router-dom";
import { fetchPlayerDetailAPI } from "../../../services/api.service.js";
import TransferHistoryTable from "../../admin/transfer-history/transfer.history.table.jsx";
import { Row, Col, Image } from 'antd';
const ClientPlayerDetail = () => {
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

    const makeCitizenshipLinks = (citizenships) => {
        if (!citizenships) return "-";
        if (!Array.isArray(citizenships)) citizenships = [citizenships];

        return citizenships.map((country, index) => (
            <Tag key={index} color="green">
                <Link to={`/players?citizenship=${encodeURIComponent(country)}`}>{country}</Link>
            </Tag>
        ));
    };

    const makePositionLinks = (positions) => {
        if (!positions) return "-";
        if (!Array.isArray(positions)) positions = [positions];

        return positions.map((pos, index) => (
            <Tag key={index} color="blue">
                <Link to={`/players?position=${encodeURIComponent(pos)}`}>{pos}</Link>
            </Tag>
        ));
    };

    const makeClubLink = () => {
        if (!player || !player.currentClub) return "No club";
        return <Link to={`/players?club=${encodeURIComponent(player.currentClub)}`}>{player.currentClub}</Link>;
    };

    if (loading || !player) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    const descriptionItems = [
        { label: "Name", value: player.name },
        { label: "Age", value: player.age },
        { label: "Date of Birth", value: formatDate(player.dob) },
        { label: "Shirt Number", value: player.shirtNumber },
        { label: "Citizenship", value: makeCitizenshipLinks(player.citizenships) },
        { label: "Position", value: makePositionLinks(player.positions) },
        { label: "Current Club", value: makeClubLink() },
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
                <h3>Transfer History</h3>
                <TransferHistoryTable
                    transferHistories={player.transferHistories || []}
                    isAdmin={false} // No admin actions for client view
                />
            </div>
        </div>
    );
};

export default ClientPlayerDetail;