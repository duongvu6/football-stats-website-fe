
import { Button, Form, message, Modal, notification } from "antd";
import { useState } from "react";
import CoachClubForm from "./coach-club.form.jsx";
import { createCoachClubAPI } from "../../../services/api.service.js";

const CreateCoachClubModal = ({ coach, isOpen, setIsOpen, onSuccess }) => {
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

            console.log("Form values on submit:", values);

            const newCoachClub = {
                headCoach: coach.id,
                startDate: values.startDate.format('YYYY-MM-DD'),
                endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
                club: values.club
            };

            console.log("Creating new coach club:", newCoachClub);

            const res = await createCoachClubAPI(newCoachClub);

            if (res && res.data) {
                message.success("Club history added successfully");
                form.resetFields();
                onSuccess();
                setIsOpen(false);
            } else {
                notification.error({
                    message: "Failed to create club history",
                    description: JSON.stringify(res.message)
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
            title="Create New Club History"
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
            <CoachClubForm
                form={form}
                formName="createCoachClub"
                coach={coach} // Pass the coach object to the form
            />
        </Modal>
    );
}

export default CreateCoachClubModal;