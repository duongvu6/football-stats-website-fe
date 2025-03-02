// epl-web/src/components/shared/player/base.player.detail.jsx
import { useEffect, useState } from "react";
import { fetchPlayerDetailAPI } from "../../../services/api.service.js";

const PlayerBaseDetail = ({
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
        // If it's the last item in the array (oldest transfer), fromClub is "-"
        // Otherwise, fromClub is the club of the next item (previous transfer chronologically)
        const fromClub = index === array.length - 1 ? "-" : array[index + 1].club;
        return {
            ...transfer,
            fromClub,
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
            title: "From Club",
            dataIndex: "fromClub",
            key: "fromClub",
        },
        {
            title: "To Club",
            dataIndex: "club",
            key: "club",
        },
        {
            title: "Type of transfer",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Market Value",
            dataIndex: "playerValue",
            key: "playerValue",
        },
        {
            title: "Transfer Fee",
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

    const baseDescriptionItems = [
        { label: "Name", value: player.name },
        { label: "Age", value: player.age },
        { label: "Shirt Number", value: player.shirtNumber },
        { label: "Citizenship", value: Array.isArray(player.citizenships) ? player.citizenships.join(', ') : player.citizenships },
        { label: "Position", value: Array.isArray(player.positions) ? player.positions.join(', ') : player.positions },
        { label: "Current Club", value: player.transferHistories && player.transferHistories[0] ? player.transferHistories[0].club : "No information" },
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

export default PlayerBaseDetail;