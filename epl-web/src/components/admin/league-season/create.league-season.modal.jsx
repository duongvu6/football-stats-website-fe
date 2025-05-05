
import { Button, Form, message, Modal, notification } from "antd";
import { useState } from "react";
import LeagueSeasonForm from "./league.season.form.jsx";
import { createLeagueSeasonAPI } from "../../../services/api.service.js";

const CreateLeagueSeasonModal = ({ league, isOpen, setIsOpen, onSuccess }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const onCancel = () => {
        setIsOpen(false);
        form.resetFields();
    }

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            const newLeagueSeason = {
                league: league.id,
                name: values.name,
                startDate: values.startDate.format('YYYY-MM-DD'),
                endDate: values.endDate.format('YYYY-MM-DD')
            };

            const res = await createLeagueSeasonAPI(newLeagueSeason);

            if (res && res.data) {
                message.success("Season added successfully");
                form.resetFields();
                onSuccess();
                setIsOpen(false);
            } else {
                notification.error({
                    message: "Failed to create season",
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
            title="Create New Season"
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
                    Create
                </Button>,
            ]}
            width={600}
            destroyOnClose={true}
        >
            <LeagueSeasonForm
                form={form}
                formName="createLeagueSeason"
            />
        </Modal>
    );
}

export default CreateLeagueSeasonModal;