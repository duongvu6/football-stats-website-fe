import { Button, Form, Input, Modal, message } from "antd";
import { useState } from "react";
import { createClubAPI } from "../../../services/api.service.js";

const CreateClubModal = ({ isOpen, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            const res = await createClubAPI(values);
            if (res.data) {
                message.success("Club created successfully");
                form.resetFields();
                onSuccess();
                onCancel();
            } else {
                message.error("Failed to create club");
            }
        } catch (error) {
            console.error("Error creating club:", error);
            message.error("An error occurred while creating the club");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title="Add New Club"
            open={isOpen}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
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
            destroyOnClose
        >
            <Form form={form} layout="vertical" name="createClubForm">
                <Form.Item
                    name="name"
                    label="Club Name"
                    rules={[{ required: true, message: "Please enter the club name" }]}
                >
                    <Input placeholder="Enter club name" />
                </Form.Item>
                <Form.Item
                    name="country"
                    label="Country"
                    rules={[{ required: true, message: "Please enter the country" }]}
                >
                    <Input placeholder="Enter country" />
                </Form.Item>
                <Form.Item
                    name="stadiumName"
                    label="Stadium Name"
                >
                    <Input placeholder="Enter stadium name" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateClubModal;