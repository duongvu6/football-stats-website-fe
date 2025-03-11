// epl-web/src/components/admin/league-season/match/edit.match.modal.jsx
import { Button, Form, Select, InputNumber, message, Modal, notification, DatePicker } from "antd";
import { useState, useEffect } from "react";
import { updateMatchAPI } from "../../../../services/api.service.js";
import dayjs from "dayjs";

const EditMatchModal = ({ match, isOpen, setIsOpen, onSuccess }) => {
    const [form] = Form.useForm();
    const [clubs, setClubs] = useState([]);
    const [loading, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && match && match.season) {
            // Reset form fields
            form.resetFields();

            // Set form values from match data
            form.setFieldsValue({
                round: match.round,
                homeClub: match.host.id,
                awayClub: match.away.id,
                homeScore: match.hostScore,
                awayScore: match.awayScore,
                date: match.date ? dayjs(match.date) : null
            });

            // Extract clubs from the season's club tables if available
            if (match.season.clubSeasonTables && match.season.clubSeasonTables.length > 0) {
                const clubOptions = match.season.clubSeasonTables.map(ct => ({
                    label: ct.club.name,
                    value: ct.club.id
                }));

                setClubs(clubOptions);
            } else {
                // Fallback: at least include the current home and away clubs
                setClubs([
                    { label: match.host.name, value: match.host.id },
                    { label: match.away.name, value: match.away.id }
                ]);
            }
        }
    }, [isOpen, match, form]);

    const onCancel = () => {
        setIsOpen(false);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            // Create match update data
            const matchData = {
                id: match.id,
                season: match.season.id,
                host: values.homeClub,
                away: values.awayClub,
                round: values.round,
                hostScore: values.homeScore,
                awayScore: values.awayScore,
                date: values.date.format('YYYY-MM-DDTHH:mm:ss')
            };

            // Call API to update match
            const res = await updateMatchAPI(matchData);

            if (res && res.data) {
                message.success("Match updated successfully");
                onSuccess();
                setIsOpen(false);
            } else {
                notification.error({
                    message: "Failed to update match",
                    description: res.message || "An unknown error occurred"
                });
            }
        } catch (error) {
            notification.error({
                message: "Form validation error",
                description: error.message || "Please check form fields"
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title="Edit Match"
            open={isOpen}
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={handleSubmit}
                >
                    Update
                </Button>,
            ]}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    name="round"
                    label="Round"
                    rules={[{ required: true, message: "Please enter round number" }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="homeClub"
                    label="Home Club"
                    rules={[{ required: true, message: "Please select home club" }]}
                >
                    <Select
                        placeholder="Select home club"
                        options={clubs}
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Form.Item>

                <Form.Item
                    name="awayClub"
                    label="Away Club"
                    rules={[
                        { required: true, message: "Please select away club" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('homeClub') !== value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Home and away clubs cannot be the same'));
                            },
                        }),
                    ]}
                >
                    <Select
                        placeholder="Select away club"
                        options={clubs}
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Form.Item>

                <Form.Item
                    name="date"
                    label="Match Date & Time"
                    rules={[{ required: true, message: "Please select match date and time" }]}
                >
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item
                    name="homeScore"
                    label="Home Score"
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="awayScore"
                    label="Away Score"
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditMatchModal;