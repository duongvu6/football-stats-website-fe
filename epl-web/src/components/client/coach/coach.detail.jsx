// epl-web/src/components/client/coach/coach.detail.jsx
import { useEffect, useState } from "react";
import { Descriptions, Spin, Tag, Table } from "antd";
import { useParams, Link } from "react-router-dom";
import { fetchCoachDetailAPI } from "../../../services/api.service.js";

const ClientCoachDetail = () => {
    const { id } = useParams();
    const [coach, setCoach] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load coach details when component mounts
    useEffect(() => {
        loadCoachDetail();
    }, [id]);

    // Function to fetch coach details from API
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

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Create citizenship links
    const makeCitizenshipLinks = (citizenships) => {
        if (!citizenships) return "-";
        if (!Array.isArray(citizenships)) citizenships = [citizenships];

        return citizenships.map((country, index) => (
            <Tag key={index} color="green" style={{marginRight: "5px"}}>
                <Link to={`/coaches?citizenship=${encodeURIComponent(country)}`}>{country}</Link>
            </Tag>
        ));
    };

    // Get current club name with link
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

    // Show loading spinner while data is being fetched
    if (loading || !coach) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    // Define columns for the club history table
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
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) => (
                <Link to={`/coaches?appointmentType=${encodeURIComponent(type)}`}>
                    {type}
                </Link>
            )
        }
    ];

    return (
        <div style={{ padding: "30px" }}>
            {/* Coach Details */}
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