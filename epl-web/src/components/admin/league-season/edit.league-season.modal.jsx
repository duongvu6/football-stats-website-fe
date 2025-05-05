
import { Button, Form, message, Modal, notification } from "antd";
import { useState, useEffect } from "react";
import LeagueSeasonForm from "./league.season.form.jsx";
import { updateLeagueSeasonAPI } from "../../../services/api.service.js";

const EditLeagueSeasonModal = ({ league, leagueSeason, isOpen, setIsOpen, onSuccess }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && leagueSeason) {
            form.resetFields();
        }
    }, [isOpen, leagueSeason, form]);

    const onCancel = () => {
        setIsOpen(false);
        form.resetFields();
    }

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            const updatedLeagueSeason = {
                id: leagueSeason.id,
                name: values.name,
                startDate: values.startDate.format('YYYY-MM-DD'),
                endDate: values.endDate.format('YYYY-MM-DD'),
                league: league.id
            };

            const res = await updateLeagueSeasonAPI(updatedLeagueSeason);

            if (res && res.data) {
                message.success("Season updated successfully");
                form.resetFields();
                onSuccess(); // Refresh the data
                setIsOpen(false);
            } else {
                notification.error({
                    message: "Failed to update season",
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
    }

    return (
        <Modal
            title="Edit Season"
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
            destroyOnClose={true}
        >
            <LeagueSeasonForm
                form={form}
                formName="editLeagueSeason"
                initialValues={leagueSeason}
            />
        </Modal>
    );
}

export default EditLeagueSeasonModal;