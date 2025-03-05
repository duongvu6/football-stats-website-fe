// epl-web/src/components/admin/transfer-history/transfer.form.jsx
import { DatePicker, Form, InputNumber, notification, Select } from "antd";
import { useEffect, useState, useRef } from "react";
import { fetchAllClubsAPI } from "../../../services/api.service.js";
import dayjs from "dayjs";

const TransferForm = ({ form, initialValues = {}, formName = "transferForm", player }) => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(false);
    const initialized = useRef(false);
    const [transferType, setTransferType] = useState(initialValues.type || null);
    const [selectedDate, setSelectedDate] = useState(initialValues.date ? dayjs(initialValues.date) : null);

    // List of transfer types that should have fee set to 0
    const zeroFeeTransferTypes = ["Free Transfer", "End of loan", "Youth Promote"];

    // Check if current transfer type should have zero fee
    const isZeroFeeTransfer = zeroFeeTransferTypes.includes(transferType);

    // Check if selected date is today
    const isToday = selectedDate && dayjs().format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD');

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
            const type = initialValues.type;
            setTransferType(type);

            const date = initialValues.date ? dayjs(initialValues.date) : null;
            setSelectedDate(date);
        }
    }, [initialValues]);

    // Update fee when transfer type changes
    useEffect(() => {
        if (isZeroFeeTransfer) {
            form.setFieldValue('fee', 0);
        }
    }, [transferType, form]);

    // Update market value when date changes to/from today
    useEffect(() => {
        if (isToday && player) {
            form.setFieldValue('playerValue', player.marketValue);
        }
    }, [isToday, player, form]);

    const fetchClubs = async () => {
        setLoading(true);
        try {
            const res = await fetchAllClubsAPI();
            if (res && res.data) {
                // Make sure clubs data is an array before mapping
                const clubsArray = Array.isArray(res.data) ? res.data :
                    (res.data.result ? res.data.result : []);

                // ALWAYS use ID as value - never use club name as value
                const clubOptions = clubsArray.map(club => ({
                    label: club.name,
                    value: club.id // Always use numeric ID as value
                }));

                setClubs(clubOptions);

                // After fetching clubs, set form values
                if (initialValues && Object.keys(initialValues).length > 0) {
                    // When club is a string (name) instead of ID, try to find matching club ID
                    if (typeof initialValues.club === 'string') {
                        const matchingClub = clubsArray.find(c => c.name === initialValues.club);
                        if (matchingClub) {
                            console.log(`Found club ID: ${matchingClub.id} for club name: ${initialValues.club}`);
                            form.setFieldValue('club', matchingClub.id);
                        } else {
                            console.warn(`Could not find club ID for name: ${initialValues.club}`);
                        }
                    } else {
                        form.setFieldValue('club', initialValues.club);
                    }

                    form.setFieldsValue({
                        date: initialValues.date ? dayjs(initialValues.date) : null,
                        type: initialValues.type,
                        fee: initialValues.fee,
                        playerValue: initialValues.playerValue || (player?.marketValue)
                    });
                } else if (player) {
                    // Set default market value from player when form initializes
                    form.setFieldValue('playerValue', player.marketValue);
                }
            }
        } catch (error) {
            notification.error({
                message: "Failed to fetch clubs",
                description: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle transfer type change
    const handleTransferTypeChange = (value) => {
        setTransferType(value);
    };

    // Handle date change
    const handleDateChange = (date) => {
        setSelectedDate(date);
        // If date is today, set market value to current player market value
        if (date && dayjs().format('YYYY-MM-DD') === date.format('YYYY-MM-DD') && player) {
            form.setFieldValue('playerValue', player.marketValue);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            name={formName}
        >
            <Form.Item
                name="date"
                label="Transfer Date"
                rules={[{ required: true, message: 'Please select transfer date' }]}
            >
                <DatePicker
                    style={{ width: '100%' }}
                    placeholder="Select transfer date"
                    format="YYYY-MM-DD"
                    onChange={handleDateChange}
                />
            </Form.Item>

            <Form.Item
                name="type"
                label="Transfer Type"
                rules={[{ required: true, message: 'Please select transfer type' }]}
            >
                <Select
                    style={{ width: '100%' }}
                    placeholder="Select Transfer Type"
                    onChange={handleTransferTypeChange}
                    options={[
                        { value: "Permanent", label: "Permanent" },
                        { value: "Free Transfer", label: "Free Transfer" },
                        { value: "Loan", label: "Loan" },
                        { value: "End of loan", label: "End of loan" },
                        { value: "Youth Promote", label: "Youth Promote" },
                    ]}
                />
            </Form.Item>

            <Form.Item
                name="playerValue"
                label="Market Value(millions Euro)"
                rules={[{ required: true, message: 'Please enter market value' }]}
                tooltip={isToday ? "Using current player market value" : undefined}
                help={isToday ? "Current player market value is automatically used for today's date" : undefined}
            >
                <InputNumber
                    step={0.5}
                    precision={1}
                    style={{ width: '100%' }}
                    disabled={isToday}
                />
            </Form.Item>

            {!isZeroFeeTransfer && (
                <Form.Item
                    name="fee"
                    label="Transfer Fee(millions Euro)"
                    rules={[{ required: true, message: 'Please enter transfer fee' }]}
                >
                    <InputNumber step={0.5} precision={1} style={{ width: '100%' }} />
                </Form.Item>
            )}

            {isZeroFeeTransfer && (
                <Form.Item
                    name="fee"
                    hidden={true}
                    initialValue={0}
                >
                    <InputNumber />
                </Form.Item>
            )}

            <Form.Item
                name="club"
                label="Joined Club"
                rules={[{ required: true, message: 'Please select a club' }]}
            >
                <Select
                    placeholder="Select club"
                    loading={loading}
                    options={clubs}
                    showSearch
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                />
            </Form.Item>
        </Form>
    );
};

export default TransferForm;