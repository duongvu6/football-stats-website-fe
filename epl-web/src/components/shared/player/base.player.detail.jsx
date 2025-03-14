import { useEffect, useState } from "react";
import { fetchPlayerDetailAPI } from "../../../services/api.service.js";
import { Link } from "react-router-dom";
import { Tag } from "antd";

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
    const transferHistories = player.transferHistories ? [...player.transferHistories].map((transfer) => {
        const fromClub = transfer.previousClub;

        // Extract club information properly
        let clubName = transfer.club;
        let clubId = null;

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
            render: (club) => {
                if (!club) return "-";
                if (typeof club === 'object' && club.name) {
                    return <Link to={`/clubs?club=${club.id}`}>{club.name}</Link>;
                }
                return club;
            }
        },
        {
            title: "Joined",
            dataIndex: "club",
            key: "club",
            render: (_, record) => {
                if (typeof record.club === 'object' && record.club && record.club.id) {
                    return <Link to={`/clubs?club=${record.club.id}`}>{record.club.name}</Link>;
                }
                if (record.clubId) {
                    return <Link to={`/clubs?club=${record.clubId}`}>{record.clubName}</Link>;
                }
                return record.clubName || "-";
            }
        },
        {
            title: "Transfer Type",
            dataIndex: "type",
            key: "type",
            render: (type) => <Link to={`/players?transferType=${encodeURIComponent(type)}`}>{type}</Link>
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

    // Create clickable components for filterable attributes
    const makePositionLinks = (positions) => {
        if (!positions) return "-";
        if (!Array.isArray(positions)) positions = [positions];

        return positions.map((pos, index) => (
            <Tag key={index} color="blue">
                <Link to={`/players?position=${encodeURIComponent(pos)}`}>{pos}</Link>
            </Tag>
        ));
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

    const makeClubLink = () => {
        if (!player.transferHistories || player.transferHistories.length === 0) return "No information";

        const latestTransfer = player.transferHistories[0];
        let clubName, clubId;

        if (typeof latestTransfer.club === 'object' && latestTransfer.club) {
            clubName = latestTransfer.club.name;
            clubId = latestTransfer.club.id;
            return <Link to={`/clubs?club=${clubId}`}>{clubName}</Link>;
        } else {
            clubName = latestTransfer.club;
            return clubName || "No information";
        }
    };

    // Enhanced base description items with clickable links
    const baseDescriptionItems = [
        { label: "Name", value: player.name },
        { label: "Age", value: player.age },
        { label: "Date of Birth", value: formatDate(player.dob) },
        { label: "Shirt Number", value: player.shirtNumber },
        { label: "Citizenship", value: makeCitizenshipLinks(player.citizenships) },
        { label: "Position", value: makePositionLinks(player.positions) },
        { label: "Current Club", value: makeClubLink() },
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