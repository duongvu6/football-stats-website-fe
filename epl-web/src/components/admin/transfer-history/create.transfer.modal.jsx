// epl-web/src/components/admin/transfer-history/create.transfer.modal.jsx
import { Button, Form, message, Modal, notification } from "antd";
import { useState } from "react";
import TransferForm from "./transfer.form.jsx";
import { createTransferHistoryAPI } from "../../../services/api.service.js";

const CreateTransferModal = ({ player, isOpen, setIsOpen, onSuccess }) => {
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

            // Check if this is a special transfer type
            const isSpecialTransferType = ["End of contract", "Retired", "Contract terminated"].includes(values.type);

            // Create a new transfer object
            const newTransfer = {
                player: player.id,
                date: values.date.format('YYYY-MM-DD'),
                club: isSpecialTransferType ? null : values.club, // Set club to null for special types
                type: values.type,
                fee: values.fee,
                playerValue: values.playerValue || player.playerValue // Use form value or player's current value
            };
            // Add API call to create transfer
            const res = await createTransferHistoryAPI(newTransfer);

            if (res && res.data) {
                message.success("Transfer added successfully");
                form.resetFields();
                onSuccess();
                setIsOpen(false);
            } else {
                notification.error({
                    message: "Failed to create transfer",
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
            title="Create New Transfer"
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
            <TransferForm
                form={form}
                formName="createTransfer"
                player={player} // Pass the player object to the form
            />
        </Modal>
    );
}

export default CreateTransferModal;