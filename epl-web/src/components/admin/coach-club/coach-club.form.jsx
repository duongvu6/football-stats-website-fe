// epl-web/src/components/admin/coach-club/coach-club.form.jsx
import { DatePicker, Form, Select } from "antd";
import { useEffect, useState, useRef } from "react";
import { fetchAllClubsAPI } from "../../../services/api.service.js";
import dayjs from "dayjs";

const CoachClubForm = ({ form, initialValues = {}, formName = "coachClubForm", coach }) => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(false);
    const initialized = useRef(false);
    // Use initialValues.type directly or default to "Appointed"
    const [appointmentType, setAppointmentType] = useState(initialValues.type || "Appointed");

    // Check if current appointment type doesn't require a club
    const isNoClubType = appointmentType === "Retired";

    useEffect(() => {
        // Log the current appointment type to debug
        console.log("Current appointment type:", appointmentType);
    }, [appointmentType]);

    // Fetch clubs only once when component mounts
    useEffect(() => {
        if (!initialized.current) {
            fetchClubs();
            initialized.current = true;
        }
    }, []);

    // Set initial values when they change
    useEffect(() => {
        if (initialValues && Object.keys(initialValues).length > 0) {
            console.log("Initial values in form:", initialValues);

            const startDate = initialValues.startDate ? dayjs(initialValues.startDate) : null;
            const endDate = initialValues.endDate ? dayjs(initialValues.endDate) : null;
            // Make sure type is preserved from initialValues
            const type = initialValues.type || "Appointed";

            // Update the state with the correct type
            setAppointmentType(type);
            console.log("Setting appointment type to:", type);

            // Extract club ID correctly
            let clubId = initialValues.club;
            if (typeof initialValues.club === 'object' && initialValues.club !== null) {
                clubId = initialValues.club.id;
            } else if (initialValues.clubId) {
                clubId = initialValues.clubId;
            }

            // Set form values including the type
            form.setFieldsValue({
                startDate: startDate,
                endDate: endDate,
                club: clubId,
                type: type // Make sure type is set properly
            });
        }
    }, [initialValues, form]);

    // Reset club field when appointment type changes
    useEffect(() => {
        if (isNoClubType) {
            form.setFieldValue('club', null);
        }
    }, [appointmentType, form, isNoClubType]);

    const fetchClubs = async () => {
        setLoading(true);
        try {
            const res = await fetchAllClubsAPI();
            if (res && res.data) {
                const clubsArray = Array.isArray(res.data) ? res.data :
                    (res.data.result ? res.data.result : []);

                const clubOptions = clubsArray.map(club => ({
                    label: club.name,
                    value: club.id // Always use numeric ID as value
                }));
                setClubs(clubOptions);

                // If initialValues has a club name string instead of ID, try to find ID
                if (initialValues && typeof initialValues.club === 'string') {
                    const matchingClub = clubsArray.find(club => club.name === initialValues.club);
                    if (matchingClub) {
                        console.log(`Found club ID: ${matchingClub.id} for club name: ${initialValues.club}`);
                        form.setFieldValue('club', matchingClub.id);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch clubs:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle appointment type change
    const handleTypeChange = (value) => {
        console.log("Type changed to:", value);
        setAppointmentType(value);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            name={formName}
            initialValues={{
                type: initialValues.type || "Appointed" // Set default type in form initialValues
            }}
        >
            <Form.Item
                name="startDate"
                label="Start Date"
                rules={[{ required: true, message: 'Please select start date' }]}
            >
                <DatePicker
                    style={{ width: '100%' }}
                    placeholder="Select start date"
                    format="YYYY-MM-DD"
                />
            </Form.Item>

            <Form.Item
                name="endDate"
                label="End Date"
                rules={[{ required: false }]}
                tooltip="Leave empty for current position"
            >
                <DatePicker
                    style={{ width: '100%' }}
                    placeholder="Select end date"
                    format="YYYY-MM-DD"
                />
            </Form.Item>

            <Form.Item
                name="type"
                label="Appointment Type"
                rules={[{ required: true, message: 'Please select appointment type' }]}
            >
                <Select
                    style={{ width: '100%' }}
                    placeholder="Select Appointment Type"
                    onChange={handleTypeChange}
                    options={[
                        { value: "Appointed", label: "Appointed" },
                        { value: "Interim", label: "Interim" },
                        { value: "Retired", label: "Retired" }
                    ]}
                />
            </Form.Item>

            <Form.Item
                name="club"
                label="Club"
                rules={[{ required: !isNoClubType, message: 'Please select a club' }]}
                tooltip={isNoClubType ? "No club required for Retired type" : ""}
            >
                <Select
                    placeholder={isNoClubType ? "No club required" : "Select club"}
                    loading={loading}
                    options={clubs}
                    showSearch
                    allowClear={isNoClubType}
                    disabled={isNoClubType}
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                />
            </Form.Item>
        </Form>
    );
};

export default CoachClubForm;