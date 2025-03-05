// epl-web/src/components/admin/transfer-history/edit.transfer.modal.jsx
import { Button, Form, message, Modal, notification } from "antd";
import { useState, useEffect } from "react";
import TransferForm from "./transfer.form.jsx";
import { updateTransferAPI } from "../../../services/api.service.js";
import dayjs from "dayjs";

const EditTransferModal = ({ player, transfer, isOpen, setIsOpen, onSuccess }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    // Initialize form with transfer data when modal opens
    useEffect(() => {
        if (isOpen && transfer) {
            console.log("Transfer to edit:", transfer);

            // Reset form first
            form.resetFields();

            // Explicitly use club ID, not name
            const clubId = typeof transfer.club === 'object' ?
                transfer.club.id :
                (transfer.clubId || transfer.club);

            console.log("Club ID to use:", clubId);

            // Set form values
            form.setFieldsValue({
                date: transfer.date ? dayjs(transfer.date) : null,
                club: clubId,
                type: transfer.type,
                fee: transfer.fee,
                playerValue: transfer.playerValue
            });
        }
    }, [isOpen, transfer, form]);

    const onCancel = () => {
        setIsOpen(false);
        form.resetFields();
    }

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            // Create a transfer object with the structure expected by the API
            const transferData = {
                id: transfer.id,
                date: values.date.format('YYYY-MM-DD'),
                type: values.type,
                playerValue: values.playerValue,
                fee: values.fee,
                player: player.id,
                club: Number(values.club) // Explicitly convert to number to ensure it's a numeric ID
            };

            console.log("Submitting transfer data:", transferData);

            // Call API to update transfer
            const res = await updateTransferAPI(transferData);

            if (res && res.data) {
                message.success("Transfer updated successfully");
                form.resetFields();
                onSuccess(); // Refresh the data
                setIsOpen(false);
            } else {
                notification.error({
                    message: "Failed to update transfer",
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
            title="Edit Transfer"
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
            <TransferForm
                form={form}
                formName="editTransfer"
                player={player}
                initialValues={transfer}
            />
        </Modal>
    );
}

export default EditTransferModal;