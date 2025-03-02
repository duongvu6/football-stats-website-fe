// epl-web/src/components/admin/transfer-history/delete.transfer.button.jsx
import { Button, Popconfirm, message, notification } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import { updatePlayerAPI } from "../../../services/api.service.js";

const DeleteTransferButton = ({ player, transfer, onSuccess }) => {
    const handleDelete = async () => {
        try {
            // Create a copy of the player's transfer history without the transfer to delete
            const updatedTransferHistory = player.transferHistories.filter(
                t => t.date !== transfer.date
            );

            // Create a copy of the player object with updated transfer history
            const updatedPlayer = {
                ...player,
                transferHistories: updatedTransferHistory
            };

            // Call API to update player with modified transfer history
            const res = await updatePlayerAPI(player.id, updatedPlayer);

            if (res && res.data) {
                message.success("Transfer deleted successfully");
                onSuccess();
            } else {
                notification.error({
                    message: "Failed to delete transfer",
                    description: JSON.stringify(res.message)
                });
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: error.message || "Failed to delete transfer"
            });
        }
    };

    return (
        <Popconfirm
            title="Delete Transfer"
            description="Are you sure you want to delete this transfer?"
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
        >
            <Button
                danger
                type="primary"
                icon={<DeleteOutlined />}
                size="small"
            />
        </Popconfirm>
    );
};

export default DeleteTransferButton;