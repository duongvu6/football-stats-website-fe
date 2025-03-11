// epl-web/src/components/admin/league/league.detail.jsx
import { Descriptions, Spin } from "antd";
import { useParams } from "react-router-dom";
import BaseLeagueDetail from "../../shared/league/base.league.detail.jsx";
import LeagueSeasonTable from "../league-season/league.season.table.jsx";
import CreateLeagueSeasonButton from "../league-season/create.league-season.button.jsx";

const AdminLeagueDetail = () => {
    const { id } = useParams();

    const {
        loading,
        league,
        leagueSeasons,
        descriptionItems,
        seasonColumns,
        loadLeagueDetail
    } = BaseLeagueDetail({
        leagueId: id,
        extraDescriptionItems: [
            { label: "ID", value: league => league?.id }
        ]
    });

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin />
            </div>
        );
    }

    return (
        <div style={{ padding: "30px" }}>
            <Descriptions title="League Details" bordered>
                {descriptionItems.map((item, index) => (
                    <Descriptions.Item key={index} label={item.label}>{item.value}</Descriptions.Item>
                ))}
            </Descriptions>
            <div style={{ marginTop: "30px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ margin: 0 }}>Seasons</h3>
                    <CreateLeagueSeasonButton league={league} onSuccess={loadLeagueDetail}/>
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