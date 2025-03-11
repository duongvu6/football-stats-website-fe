// epl-web/src/components/admin/league-season/club-season/edit.club-season.modal.jsx
import { Button, Form, InputNumber, message, Modal, notification } from "antd";
import { useState, useEffect } from "react";
import { updateClubSeasonTableAPI } from "../../../../services/api.service.js";

const EditClubSeasonModal = ({ clubSeason, isOpen, setIsOpen, onSuccess }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && clubSeason) {
            form.setFieldsValue({
                points: clubSeason.points,
                ranked: clubSeason.ranked,
                numWins: clubSeason.numWins,
                numLosses: clubSeason.numLosses,
                numDraws: clubSeason.numDraws,
                goalScores: clubSeason.goalScores,
                goalConceded: clubSeason.goalConceded
            });
        }
    }, [isOpen, clubSeason, form]);

    const onCancel = () => {
        setIsOpen(false);
        form.resetFields();
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            // Calculate goal difference
            const goalDiff = values.goalScores - values.goalConceded;

            // Create the club season data structure for the update
            const clubSeasonData = {
                id: clubSeason.id,
                season: clubSeason.season.id,
                club: clubSeason.club.id,
                points: values.points,
                ranked: values.ranked,
                numWins: values.numWins,
                numLosses: values.numLosses,
                numDraws: values.numDraws,
                goalScores: values.goalScores,
                goalConceded: values.goalConceded,
                diff: goalDiff
            };

            // Call API to update club season
            const res = await updateClubSeasonTableAPI(clubSeasonData);

            if (res && res.data) {
                message.success("Club season updated successfully");
                form.resetFields();
                onSuccess(); // Refresh club season data
                setIsOpen(false);
            } else {
                notification.error({
                    message: "Failed to update club season",
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
            title={`Edit ${clubSeason?.club?.name} Season Stats`}
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
                    name="ranked"
                    label="Position"
                    rules={[{ required: true, message: "Please enter position" }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="numWins"
                    label="Wins"
                    rules={[{ required: true, message: "Please enter wins" }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="numDraws"
                    label="Draws"
                    rules={[{ required: true, message: "Please enter draws" }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="numLosses"
                    label="Losses"
                    rules={[{ required: true, message: "Please enter losses" }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="goalScores"
                    label="Goals Scored"
                    rules={[{ required: true, message: "Please enter goals scored" }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="goalConceded"
                    label="Goals Conceded"
                    rules={[{ required: true, message: "Please enter goals conceded" }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="points"
                    label="Points"
                    rules={[{ required: true, message: "Please enter points" }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditClubSeasonModal;