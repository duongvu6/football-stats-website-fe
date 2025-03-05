// epl-web/src/components/admin/coach-club/create.coach-club.modal.jsx
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

            // Check if this is a special type that doesn't require a club
            const isNoClubType = values.type === "Retired";
            console.log("Form values on submit:", values);

            // Create a new coach club object
            const newCoachClub = {
                headCoach: coach.id,
                startDate: values.startDate.format('YYYY-MM-DD'),
                endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
                club: isNoClubType ? null : values.club,
                type: values.type // Ensure type is preserved
            };

            console.log("Creating new coach club:", newCoachClub);

            // Add API call to create coach club
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