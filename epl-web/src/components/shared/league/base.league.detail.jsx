// epl-web/src/components/shared/league/base.league.detail.jsx
import { useEffect, useState } from "react";
import { fetchLeagueDetailAPI } from "../../../services/api.service.js";
import { notification } from "antd";

const BaseLeagueDetail = ({
                              leagueId,
                              extraDescriptionItems = [],
                              extraSeasonColumns = []
                          }) => {
    const [league, setLeague] = useState(null);
    const [loading, setLoadingData] = useState(true);

    useEffect(() => {
        loadLeagueDetail();
    }, [leagueId]);

    const loadLeagueDetail = async () => {
        setLoadingData(true);
        try {
            const res = await fetchLeagueDetailAPI(leagueId);
            if (res.data) {
                setLeague(res.data);
            }
        } catch (error) {
            console.error("Error loading league detail:", error);
            notification.error({
                message: "Error loading league detail",
                description: error.message
            });
        } finally {
            setLoadingData(false);
        }
    };

    // Function to format dates
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Return loading state and league data
    if (loading || !league) {
        return {
            loading: true,
            league: null,
            leagueSeasons: [],
            descriptionItems: [],
            seasonColumns: [],
            loadLeagueDetail
        };
    }

    // Process league seasons
    const leagueSeasons = league.leagueSeasons ? [...league.leagueSeasons].map((season) => {
        return {
            ...season,
            formattedStartDate: formatDate(season.startDate),
            formattedEndDate: formatDate(season.endDate)
        };
    }) : [];

    const baseSeasonColumns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Start Date",
            dataIndex: "formattedStartDate",
            key: "startDate",
        },
        {
            title: "End Date",
            dataIndex: "formattedEndDate",
            key: "endDate",
        },
        ...extraSeasonColumns
    ];

    // Process extraDescriptionItems to safely handle functions
    const processedExtraItems = extraDescriptionItems.map(item => ({
        label: item.label,
        value: typeof item.value === 'function' ? item.value(league) : item.value
    }));

    // Base description items for the league
    const baseDescriptionItems = [
        { label: "Name", value: league.name },
        { label: "Current Season", value: leagueSeasons && leagueSeasons.length > 0 ?
                leagueSeasons[0].name : "No active season" },
        ...processedExtraItems
    ];

    return {
        loading: false,
        league,
        leagueSeasons,
        loadLeagueDetail,
        descriptionItems: baseDescriptionItems,
        seasonColumns: baseSeasonColumns
    };
};

export default BaseLeagueDetail;