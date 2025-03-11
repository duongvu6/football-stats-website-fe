// epl-web/src/components/admin/league-season/match/create.match.modal.jsx
import { Button, Form, Select, InputNumber, message, Modal, notification, DatePicker } from "antd";
import { useState, useEffect } from "react";
import { createMatchAPI } from "../../../../services/api.service.js";
import dayjs from "dayjs";

const CreateMatchModal = ({ leagueSeason, isOpen, setIsOpen, onSuccess }) => {
    const [form] = Form.useForm();
    const [clubs, setClubs] = useState([]);
    const [loading, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && leagueSeason) {
            // Extract clubs from the league season's clubSeasonTables
            if (leagueSeason.clubSeasonTables && leagueSeason.clubSeasonTables.length > 0) {
                const clubOptions = leagueSeason.clubSeasonTables.map(ct => ({
                    label: ct.club.name,
                    value: ct.club.id
                }));

                setClubs(clubOptions);
            }

            // Reset form
            form.resetFields();
        }
    }, [isOpen, leagueSeason, form]);

    const onCancel = () => {
        setIsOpen(false);
        form.resetFields();
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            // Create match data object
            const matchData = {
                season: leagueSeason.id,
                host: values.homeClub,
                away: values.awayClub,
                round: values.round || 1,
                hostScore: values.homeScore || 0,
                awayScore: values.awayScore || 0,
                date: values.date ? values.date.format('YYYY-MM-DDTHH:mm:ss') : dayjs().format('YYYY-MM-DDTHH:mm:ss')
            };

            // Call API to create match
            const res = await createMatchAPI(matchData);

            if (res && res.data) {
                message.success("Match created successfully");
                form.resetFields();
                onSuccess();
                setIsOpen(false);
            } else {
                notification.error({
                    message: "Failed to create match",
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
            title="Create New Match"
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
                    Create
                </Button>,
            ]}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    round: 1,
                    homeScore: 0,
                    awayScore: 0,
                    date: dayjs()
                }}
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

export default CreateMatchModal;