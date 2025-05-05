import { Modal, Form, Button, message } from "antd";
import { useState } from "react";
import { createPlayerAPI } from "../../../services/api.service.js";
import PlayerForm from "./player.form.jsx";

const CreatePlayerModal = ({ isOpen, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            const formattedValues = {
                ...values,
                dob: values.dob ? values.dob.format('YYYY-MM-DD') : null
            };

            const res = await createPlayerAPI(formattedValues);
            if (res.data) {
                message.success("Player created successfully");
                form.resetFields();
                onSuccess();
            } else {
                message.error("Failed to create player");
            }
        } catch (error) {
            console.error("Form validation or submission error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title="Add New Player"
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
            <PlayerForm form={form} formName="createPlayerForm" />
        </Modal>
    );
};

export default CreatePlayerModal;