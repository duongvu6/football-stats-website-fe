// epl-web/src/components/admin/transfer-history/create.transfer.modal.jsx
import { Button, Form, message, Modal, notification } from "antd";
import { useState } from "react";
import TransferForm from "./transfer.form.jsx";
import { createTransferHistoryAPI } from "../../../services/api.service.js";

const CreateTransferModal = ({ player, isOpen, setIsOpen, onSuccess }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    // Close modal and reset form
    const onCancel = () => {
        setIsOpen(false);
        form.resetFields();
    };

    // Submit form data to create new transfer
    const handleSubmit = async () => {
        try {
            // Validate form fields
            const values = await form.validateFields();
            setSubmitting(true);

            // Special transfer types don't need a club
            const isSpecialTransferType = ["End of contract", "Retired", "Contract terminated"].includes(values.type);

            // Create a new transfer object
            const newTransfer = {
                player: player.id,
                date: values.date.format('YYYY-MM-DD'),
                club: isSpecialTransferType ? null : values.club,
                type: values.type,
                fee: values.fee,
                playerValue: values.playerValue || player.marketValue
            };

            // Call API to create transfer
            const res = await createTransferHistoryAPI(newTransfer);

            if (res && res.data) {
                message.success("Transfer added successfully");
                form.resetFields();
                onSuccess();
                setIsOpen(false);
            } else {
                notification.error({
                    message: "Failed to create transfer",
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
    };

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
        >
            <TransferForm
                form={form}
                player={player}
            />
        </Modal>
    );
};

export default CreateTransferModal;