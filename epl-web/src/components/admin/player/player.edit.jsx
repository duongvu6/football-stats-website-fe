
import { Modal, Form, Button, message } from "antd";
import { useState, useEffect } from "react";
import { updatePlayerAPI } from "../../../services/api.service.js";
import PlayerForm from "./player.form.jsx";

const EditPlayerModal = ({ isOpen, onCancel, onSuccess, player }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            form.resetFields();
        }
    }, [isOpen, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            const formattedValues = {
                ...values,
                dob: values.dob ? values.dob.format('YYYY-MM-DD') : null,
                id: player.id
            };

            console.log('Submitting player update:', formattedValues);

            const res = await updatePlayerAPI(formattedValues);
            if (res.data) {
                message.success("Player updated successfully");

                onSuccess();
                onCancel(); // Close the modal
            } else {
                message.error("Failed to update player");
            }
        } catch (error) {
            console.error("Form validation or submission error:", error);
            message.error("Please check the form fields and try again");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title="Edit Player"
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
            {isOpen && player && (
                <PlayerForm
                    form={form}
                    initialValues={player}
                    formName="editPlayerForm"
                />
            )}
        </Modal>
    );
};

export default EditPlayerModal;