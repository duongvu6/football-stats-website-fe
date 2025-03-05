// epl-web/src/components/shared/coach/base.coach.detail.jsx
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

    // Process coach club history
    const coachClubs = coach.coachClubs ? [...coach.coachClubs].map((clubHistory, index) => {
        // Extract club information properly
        let clubName = clubHistory.club;
        let clubId = clubHistory.club;

        // If club is an object with name and id properties
        if (typeof clubHistory.club === 'object' && clubHistory.club !== null) {
            clubName = clubHistory.club.name || '';
            clubId = clubHistory.club.id;
        }

        return {
            ...clubHistory,
            formattedStartDate: formatDate(clubHistory.startDate),
            formattedEndDate: formatDate(clubHistory.endDate) || "Present",
            clubName,
            clubId
        };
    }) : [];

    // Removed "Type" column from baseTransferColumns
    const baseTransferColumns = [
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
        {
            title: "Club",
            dataIndex: "club",
            key: "club",
            render: (text, record) => record.clubName || text
        },
        ...extraTransferColumns
    ];

    // Process extraDescriptionItems to safely handle functions
    const processedExtraItems = extraDescriptionItems.map(item => ({
        label: item.label,
        value: typeof item.value === 'function' ? item.value(coach) : item.value
    }));

    // Enhanced base description items with coach information
    const baseDescriptionItems = [
        { label: "Name", value: coach.name },
        { label: "Age", value: coach.age },
        { label: "Date of Birth", value: formatDate(coach.dob) },
        { label: "Citizenship", value: Array.isArray(coach.citizenships) ? coach.citizenships.join(', ') : coach.citizenships },
        { label: "Current Club", value: coach.coachClubs && coach.coachClubs.length > 0 ?
                (typeof coach.coachClubs[0].club === 'object' ?
                    coach.coachClubs[0].club.name : coach.coachClubs[0].club) :
                "No information" },
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