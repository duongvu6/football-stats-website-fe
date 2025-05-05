
import { Descriptions, Spin, notification } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchLeagueDetailAPI } from "../../../services/api.service.js";
import LeagueSeasonTable from "../league-season/league.season.table.jsx";
import CreateLeagueSeasonButton from "../league-season/create.league-season.button.jsx";

const AdminLeagueDetail = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [league, setLeague] = useState(null);
    const [leagueSeasons, setLeagueSeasons] = useState([]);

    const loadLeagueDetail = async () => {
        setLoading(true);
        try {
            const response = await fetchLeagueDetailAPI(id);
            if (response.data) {
                setLeague(response.data);

                if (response.data.leagueSeasons && Array.isArray(response.data.leagueSeasons)) {
                    setLeagueSeasons(response.data.leagueSeasons);
                } else {
                    setLeagueSeasons([]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch league details:", error);
            notification.error({
                message: "Error",
                description: "Failed to load league details"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLeagueDetail();
    }, [id]);

    const seasonColumns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Start Date",
            dataIndex: "startDate",
            key: "startDate",
            render: (date) => formatDate(date)
        },
        {
            title: "End Date",
            dataIndex: "endDate",
            key: "endDate",
            render: (date) => formatDate(date)
        }
    ];

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
                <p>League not found</p>
            </div>
        );
    }

    return (
        <div style={{ padding: "30px" }}>
            <Descriptions title="League Details" bordered>
                <Descriptions.Item label="ID">{league.id}</Descriptions.Item>
                <Descriptions.Item label="Name">{league.name}</Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: "30px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ margin: 0 }}>Seasons</h3>
                    <CreateLeagueSeasonButton league={league} onSuccess={loadLeagueDetail} />
                </div>

                <LeagueSeasonTable
                    seasonColumns={seasonColumns}
                    leagueSeasons={leagueSeasons}
                    league={league}
                    onSuccess={loadLeagueDetail}
                    isAdmin={true}
                />
            </div>
        </div>
    );
};

export default AdminLeagueDetail;