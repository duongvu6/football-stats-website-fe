import {useEffect, useState} from "react";
import {Card, Descriptions, notification, Spin} from "antd";
import {fetchClubDetailAPI} from "../../../services/api.service.js";
import {useParams} from "react-router-dom";

const AdminClubDetail = () => {
    const {id} = useParams();
    const [club, setClub] = useState(null);;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadClubDetail();
    }, [id]);

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
        <>
            <div style={{padding: "30px"}}>
                <Card title="Club Information">
                    <Descriptions bordered>
                        <Descriptions.Item label="ID">{club.id}</Descriptions.Item>
                        <Descriptions.Item label="Name">{club.name}</Descriptions.Item>
                        <Descriptions.Item label="Country">{club.country}</Descriptions.Item>
                        <Descriptions.Item label="Stadium Name">{club.stadiumName}</Descriptions.Item>
                    </Descriptions>
                </Card>
            </div>
        </>
    )

};
export default AdminClubDetail;