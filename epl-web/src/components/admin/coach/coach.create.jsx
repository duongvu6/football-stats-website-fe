import {Button, Form, message, Modal} from "antd";
import {useState} from "react";
import {createCoachAPI, createPlayerAPI} from "../../../services/api.service.js";
import PlayerForm from "../player/player.form.jsx";
import CoachForm from "./coach.form.jsx";

const CreateCoachModal = ({ isOpen, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            // Format the date for the API
            const formattedValues = {
                ...values,
                dob: values.dob ? values.dob.format('YYYY-MM-DD') : null
            };

            const res = await createCoachAPI(formattedValues);
            if (res.data) {
                message.success("Head Coach created successfully");
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
            title="Add New Head Coach"
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
            <CoachForm form={form} formName="createCoachForm" />
        </Modal>
    );
};

export default CreateCoachModal;