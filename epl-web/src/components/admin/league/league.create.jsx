import { Button, Form, message, Modal } from "antd";
import { useState } from "react";
import { createLeagueAPI } from "../../../services/api.service.js";
import LeagueForm from "./league.form.jsx";

const CreateLeagueModal = ({ isOpen, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            const res = await createLeagueAPI(values);
            if (res.data) {
                message.success("League created successfully");
                form.resetFields();
                onSuccess();
            } else {
                message.error("Failed to create league");
            }
        } catch (error) {
            console.error("Form validation or submission error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title="Add New League"
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
            <LeagueForm form={form} formName="createLeagueForm" />
        </Modal>
    );
};

export default CreateLeagueModal;