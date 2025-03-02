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

        // Set initial values if provided
        if (initialValues && Object.keys(initialValues).length > 0) {
            const type = initialValues.type;
            setTransferType(type);

            const date = initialValues.date ? dayjs(initialValues.date) : null;
            setSelectedDate(date);

            form.setFieldsValue({
                date: date,
                type: type,
                fee: initialValues.fee,
                club: initialValues.club,
                playerValue: initialValues.playerValue || (player?.marketValue)
            });
        } else if (player) {
            // Set default market value from player when form initializes
            form.setFieldValue('playerValue', player.marketValue);
        }
    }, [initialValues, player]); // Remove form from dependencies

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
                const clubOptions = clubsArray.map(club => ({
                    label: club.name,
                    value: club.id || club.name
                }));
                setClubs(clubOptions);
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

            {/* Market Value field - renamed to playerValue but shown as "Market Value" */}
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

            {/* Fee field - only shown for transfers that require a fee */}
            {!isZeroFeeTransfer && (
                <Form.Item
                    name="fee"
                    label="Transfer Fee(millions Euro)"
                    rules={[{ required: true, message: 'Please enter transfer fee' }]}
                >
                    <InputNumber step={0.5} precision={1} style={{ width: '100%' }} />
                </Form.Item>
            )}

            {/* Hidden form item to ensure fee is submitted even when field is hidden */}
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