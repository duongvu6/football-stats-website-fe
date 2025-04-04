import {Button, Form, Input, Modal, message, notification} from "antd";
import { useEffect, useState } from "react";
import { editClubAPI } from "../../../services/api.service.js";

const EditClubModal = ({ isOpen, onCancel, onSuccess, club }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && club) {
            form.setFieldsValue(club);
        }
    }, [isOpen, club, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            const updatedClub = { ...values, id: club.id };
            const res = await editClubAPI(updatedClub);
            if (res.data) {
                message.success("Club updated successfully");
                onSuccess();
                onCancel();
            } else {
                message.error("Failed to update club");
            }
        } catch (error) {
            console.error("Error updating club:", error);
            notification.error({
                description:"An error occurred while updating the club",
                message: error.message
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title="Edit Club"
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
                    Update
                </Button>,
            ]}
            width={600}
            destroyOnClose
        >
            <Form form={form} layout="vertical" name="editClubForm">
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

export default EditClubModal;