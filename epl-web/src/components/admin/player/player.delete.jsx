// epl-web/src/components/admin/player/player.delete.jsx
import { Popconfirm, Button, message } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import { deletePlayerAPI } from "../../../services/api.service.js";

const DeletePlayerButton = ({ playerId, onSuccess }) => {
    const handleDelete = async () => {
        try {
            const res = await deletePlayerAPI(playerId);
            if (res.data) {
                message.success("Player deleted successfully");
                // Call onSuccess to refresh data but stay on current page
                onSuccess();
            } else {
                message.error("Failed to delete player");
            }
        } catch (error) {
            message.error("An error occurred while deleting the player");
            console.error(error);
        }
    };

    return (
        <Popconfirm
            title="Delete player"
            description="Are you sure you want to delete this player?"
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

export default DeletePlayerButton;