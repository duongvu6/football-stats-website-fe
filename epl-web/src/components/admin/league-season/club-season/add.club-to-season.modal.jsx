// epl-web/src/components/admin/league-season/club-season/add.club-to-season.modal.jsx
import { Button, Form, Select, InputNumber, message, Modal, notification } from "antd";
import { useState, useEffect } from "react";
import { fetchAllClubsAPI, createClubSeasonTableAPI } from "../../../../services/api.service.js";

const AddClubToSeasonModal = ({ leagueSeason, isOpen, setIsOpen, onSuccess }) => {
    const [form] = Form.useForm();
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Fetch clubs when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchClubs();
            form.resetFields();
        }
    }, [isOpen, form]);

    const fetchClubs = async () => {
        setLoading(true);
        try {
            const res = await fetchAllClubsAPI();
            if (res && res.data) {
                // Handle both array response and paginated response
                const clubsArray = Array.isArray(res.data) ? res.data :
                    (res.data.result ? res.data.result : []);

                // Filter out clubs that are already in the season
                const existingClubIds = leagueSeason.clubSeasonTables?.map(ct => ct.club.id) || [];
                const filteredClubs = clubsArray.filter(club => !existingClubIds.includes(club.id));

                const clubOptions = filteredClubs.map(club => ({
                    label: club.name,
                    value: club.id
                }));

                setClubs(clubOptions);
            }
        } catch (error) {
            console.error("Failed to fetch clubs:", error);
            notification.error({
                message: "Error",
                description: "Failed to load clubs"
            });
        } finally {
            setLoading(false);
        }
    };

    const onCancel = () => {
        setIsOpen(false);
        form.resetFields();
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            // Create the club season data structure
            const clubSeasonData = {
                season: leagueSeason.id,
                club: values.club,
                points: values.points || 0,
                ranked: values.ranked || 0,
                numWins: values.numWins || 0,
                numLosses: values.numLosses || 0,
                numDraws: values.numDraws || 0,
                goalScores: values.goalScores || 0,
                goalConceded: values.goalConceded || 0,
                diff: (values.goalScores || 0) - (values.goalConceded || 0)
            };

            // Call API to create club season
            const res = await createClubSeasonTableAPI(clubSeasonData);

            if (res && res.data) {
                message.success("Club added to season successfully");
                form.resetFields();
                onSuccess(); // Refresh club season data
                setIsOpen(false);
            } else {
                notification.error({
                    message: "Failed to add club to season",
                    description: res.message || "An unknown error occurred"
                });
            }
        } catch (error) {
            notification.error({
                message: "Form validation error",
                description: error.message || "Please check the form fields"
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title="Add Club to Season"
            open={isOpen}
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={submitting}
                    onClick={handleSubmit}
                >
                    Add
                </Button>,
            ]}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    points: 0,
                    ranked: 0,
                    numWins: 0,
                    numLosses: 0,
                    numDraws: 0,
                    goalScores: 0,
                    goalConceded: 0
                }}
            >
                <Form.Item
                    name="club"
                    label="Club"
                    rules={[{ required: true, message: "Please select a club" }]}
                >
                    <Select
                        placeholder="Select club"
                        options={clubs}
                        loading={loading}
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Form.Item>

                <Form.Item
                    name="ranked"
                    label="Position"
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="numWins"
                    label="Wins"
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="numDraws"
                    label="Draws"
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="numLosses"
                    label="Losses"
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="goalScores"
                    label="Goals Scored"
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="goalConceded"
                    label="Goals Conceded"
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="points"
                    label="Points"
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddClubToSeasonModal;