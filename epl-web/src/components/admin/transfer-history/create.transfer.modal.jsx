// epl-web/src/components/admin/transfer-history/create.transfer.modal.jsx
import { Button, Form, message, Modal, notification } from "antd";
import { useState } from "react";
import TransferForm from "./transfer.form.jsx";
import { updatePlayerAPI } from "../../../services/api.service.js";

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

            // Create a new transfer object
            const newTransfer = {
                player: player.id,
                date: values.date.format('YYYY-MM-DD'),
                club: values.club,
                type: values.type,
                fee: values.fee,
                playerValue: values.playerValue || player.playerValue // Use form value or player's current value
            };

            // Create a copy of the player object to modify
            const updatedPlayer = {
                ...player,
                // Add the new transfer to the beginning of the array
                transferHistories: [
                    newTransfer,
                    // ...(player.transferHistories || [])
                ]
            };

            // Add API call to create transfer
            const res = await updatePlayerAPI(updatedPlayer);

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