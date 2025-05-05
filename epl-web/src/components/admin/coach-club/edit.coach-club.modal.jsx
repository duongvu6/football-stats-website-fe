
import { Button, Form, message, Modal, notification } from "antd";
import { useState, useEffect } from "react";
import CoachClubForm from "./coach-club.form.jsx";
import { updateCoachClubAPI } from "../../../services/api.service.js";
import dayjs from "dayjs";

const EditCoachClubModal = ({ coach, coachClub, isOpen, setIsOpen, onSuccess }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && coachClub) {
            console.log("Coach Club to edit:", coachClub);

            form.resetFields();

            let clubId = coachClub.club;
            if (typeof coachClub.club === 'object' && coachClub.club !== null) {
                clubId = coachClub.club.id;
                console.log("Extracted club ID from object:", clubId);
            } else if (coachClub.clubId) {
                clubId = coachClub.clubId;
                console.log("Using clubId property:", clubId);
            }

            form.setFieldsValue({
                startDate: coachClub.startDate ? dayjs(coachClub.startDate) : null,
                endDate: coachClub.endDate ? dayjs(coachClub.endDate) : null,
                club: clubId
            });
        }
    }, [isOpen, coachClub, form]);

    const onCancel = () => {
        setIsOpen(false);
        form.resetFields();
    }

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            console.log("Form values on submit:", values);

            const coachClubData = {
                id: coachClub.id,
                startDate: values.startDate.format('YYYY-MM-DD'),
                endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
                headCoach: coach.id,
                club: Number(values.club)
            };

            console.log("Submitting coach club data:", coachClubData);

            const res = await updateCoachClubAPI(coachClubData);

            if (res && res.data) {
                message.success("Club history updated successfully");
                form.resetFields();
                onSuccess(); // Refresh the data
                setIsOpen(false);
            } else {
                notification.error({
                    message: "Failed to update club history",
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
            title="Edit Club History"
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
            <CoachClubForm
                form={form}
                formName="editCoachClub"
                coach={coach}
                initialValues={coachClub}
            />
        </Modal>
    );
}

export default EditCoachClubModal;