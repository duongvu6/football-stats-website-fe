import {useEffect, useState} from "react";
import {fetchCoachDetailAPI} from "../../../services/api.service.js";
import {notification} from "antd";

const BaseCoachDetail = ({
                              coachId,
                              extraDescriptionItems = [],
                              renderTransferHeader,
                              extraTransferColumns = []
                          }) => {
    const [coach, setCoach] = useState(null);
    const [loading, setLoadingData] = useState(true);

    useEffect(() => {
        loadCoachDetail();
    }, [coachId]);

    const loadCoachDetail = async () => {
        setLoadingData(true);
        try {
            const res = await fetchCoachDetailAPI(coachId);
            if (res.data) {
                setCoach(res.data);
            }
        } catch (error) {
            console.error("Error loading coach detail:", error);
            notification.error({
                message: "Error loading coach detail:",
                description: error
            })
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
    if (loading || !coach) {
        return {
            loading: true,
            coach: null,
            coachClubs: [],
            descriptionItems: [],
            transferColumns: [],
            loadCoachDetail
        };
    }

    // Process transfer history to add fromClub
    const coachClubs = coach.coachClubs ? [...coach.coachClubs].map((transfer, index, array) => {
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
        ...extraTransferColumns
    ];

    // Process extraDescriptionItems to safely handle functions
    const processedExtraItems = extraDescriptionItems.map(item => ({
        label: item.label,
        value: typeof item.value === 'function' ? item.value(coach) : item.value
    }));

    // Enhanced base description items with more player information
    const baseDescriptionItems = [
        { label: "Name", value: coach.name },
        { label: "Age", value: coach.age },
        { label: "Date of Birth", value: formatDate(coach.dob) },
        { label: "Citizenship", value: Array.isArray(coach.citizenships) ? coach.citizenships.join(', ') : coach.citizenships },
        { label: "Current Club", value: coach.coachClubs && coach.coachClubs[0] ? coach.coachClubs[0].club : "No information" },
        ...processedExtraItems
    ];

    return {
        loading: false,
        coach,
        coachClubs,
        loadCoachDetail,
        descriptionItems: baseDescriptionItems,
        transferColumns: baseTransferColumns
    };
};

export default BaseCoachDetail;