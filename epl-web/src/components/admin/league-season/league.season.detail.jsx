// epl-web/src/components/admin/league-season/league.season.detail.jsx
import { Tabs, Spin } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchLeagueSeasonDetailAPI } from "../../../services/api.service.js";
import ClubSeasonTable from "./club-season/club.season.table.jsx";
import MatchTable from "./match/match.table.jsx";

const LeagueSeasonDetail = () => {
    const { id } = useParams();
    const [leagueSeason, setLeagueSeason] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadLeagueSeasonDetail = async () => {
        setLoading(true);
        try {
            const res = await fetchLeagueSeasonDetailAPI(id);
            if (res.data) {
                // Add onRefresh method to the leagueSeason object
                setLeagueSeason({
                    ...res.data,
                    onRefresh: loadLeagueSeasonDetail
                });
            }
        } catch (error) {
            console.error("Error loading league season detail:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLeagueSeasonDetail();
    }, [id]);

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin />
            </div>
        );
    }

    return (
        <div style={{ padding: "30px" }}>
            <h2>Season: {leagueSeason?.name} ({leagueSeason?.league?.name})</h2>
            <Tabs defaultActiveKey="clubs">
                <Tabs.TabPane tab="Clubs" key="clubs">
                    <ClubSeasonTable leagueSeason={leagueSeason} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Matches" key="matches">
                    <MatchTable leagueSeason={leagueSeason} />
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};

export default LeagueSeasonDetail;