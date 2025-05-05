
import { DatePicker, Form, Select } from "antd";
import { useEffect, useState, useRef } from "react";
import { fetchAllClubsAPI } from "../../../services/api.service.js";
import dayjs from "dayjs";

const CoachClubForm = ({ form, initialValues = {}, formName = "coachClubForm", coach }) => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(false);
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            fetchClubs();
            initialized.current = true;
        }
    }, []);

    useEffect(() => {
        if (initialValues && Object.keys(initialValues).length > 0) {
            const startDate = initialValues.startDate ? dayjs(initialValues.startDate) : null;
            const endDate = initialValues.endDate ? dayjs(initialValues.endDate) : null;

            let clubId = initialValues.club;
            if (typeof initialValues.club === 'object' && initialValues.club !== null) {
                clubId = initialValues.club.id;
            } else if (initialValues.clubId) {
                clubId = initialValues.clubId;
            }

            form.setFieldsValue({
                startDate: startDate,
                endDate: endDate,
                club: clubId,
            });
        }
    }, [initialValues, form]);

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

    return (
        <Form
            form={form}
            layout="vertical"
            name={formName}
        >
            <Form.Item
                name="startDate"
                label="Start Date"
                rules={[{ required: true, message: 'Please select a start date' }]}
            >
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="endDate"
                label="End Date"
                dependencies={['startDate']}
                rules={[
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || !getFieldValue('startDate') || value.isAfter(getFieldValue('startDate'))) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('End date must be after start date'));
                        },
                    }),
                ]}
            >
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="club"
                label="Club"
                rules={[{ required: true, message: 'Please select a club' }]}
            >
                <Select
                    placeholder="Select club"
                    loading={loading}
                    options={clubs}
                    showSearch
                    allowClear
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                />
            </Form.Item>
        </Form>
    );
};

export default CoachClubForm;