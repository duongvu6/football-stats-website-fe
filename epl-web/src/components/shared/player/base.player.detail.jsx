// epl-web/src/components/shared/player/base.player.detail.jsx
import { useEffect, useState } from "react";
import { fetchPlayerDetailAPI } from "../../../services/api.service.js";

const BasePlayerDetail = ({
                              playerId,
                              extraDescriptionItems = [],
                              renderTransferHeader,
                              extraTransferColumns = []
                          }) => {
    const [player, setPlayer] = useState(null);
    const [loading, setLoadingData] = useState(true);

    useEffect(() => {
        loadPlayerDetail();
    }, [playerId]);

    const loadPlayerDetail = async () => {
        setLoadingData(true);
        try {
            const res = await fetchPlayerDetailAPI(playerId);
            if (res.data) {
                setPlayer(res.data);
            }
        } catch (error) {
            console.error("Error loading player detail:", error);
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

    // Return loading state and player data
    if (loading || !player) {
        return {
            loading: true,
            player: null,
            transferHistories: [],
            descriptionItems: [],
            transferColumns: [],
            loadPlayerDetail
        };
    }

    // Process transfer history to add fromClub
    const transferHistories = player.transferHistories ? [...player.transferHistories].map((transfer, index, array) => {
        const fromClub = transfer.previousClub;

        // Extract club information properly
        let clubName = transfer.club;
        let clubId = transfer.club;

        // If club is an object with name and id properties
        if (typeof transfer.club === 'object' && transfer.club !== null) {
            clubName = transfer.club.name || '';
            clubId = transfer.club.id;
        }

        return {
            ...transfer,
            fromClub,
            clubName,  // Store club name for display
            clubId,    // Store club ID for form operations
            formattedDate: formatDate(transfer.date)
        };
    }) : [];

    const baseTransferColumns = [
        {
            title: "Date",
            dataIndex: "formattedDate",
            key: "date",
        },
        {
            title: "Left",
            dataIndex: "fromClub",
            key: "fromClub",
        },
        {
            title: "Joined",
            dataIndex: "club",
            key: "club",
        },
        {
            title: "Transfer Type",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Market Value (millions Euro)",
            dataIndex: "playerValue",
            key: "playerValue",
        },
        {
            title: "Transfer Fee(millions Euro)",
            dataIndex: "fee",
            key: "transferFee",
        },
        ...extraTransferColumns
    ];

    // Process extraDescriptionItems to safely handle functions
    const processedExtraItems = extraDescriptionItems.map(item => ({
        label: item.label,
        value: typeof item.value === 'function' ? item.value(player) : item.value
    }));

    // Enhanced base description items with more player information
    const baseDescriptionItems = [
        { label: "Name", value: player.name },
        { label: "Age", value: player.age },
        { label: "Date of Birth", value: formatDate(player.dob) },
        { label: "Shirt Number", value: player.shirtNumber },
        { label: "Citizenship", value: Array.isArray(player.citizenships) ? player.citizenships.join(', ') : player.citizenships },
        { label: "Position", value: Array.isArray(player.positions) ? player.positions.join(', ') : player.positions },
        { label: "Current Club", value: player.transferHistories && player.transferHistories[0] ? player.transferHistories[0].club : "No information" },
        { label: "Market Value (millions Euro)", value: player.marketValue },
        ...processedExtraItems
    ];

    return {
        loading: false,
        player,
        transferHistories,
        loadPlayerDetail,
        descriptionItems: baseDescriptionItems,
        transferColumns: baseTransferColumns
    };
};

export default BasePlayerDetail;