
import { Button, Popconfirm, message, notification } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import {deleteTransferAPI, updatePlayerAPI} from "../../../services/api.service.js";

const DeleteTransferButton = ({ player, transfer, onSuccess }) => {
    const handleDelete = async () => {
        try {

            const res = await deleteTransferAPI(transfer.id);

            if (res.status === 200) {
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