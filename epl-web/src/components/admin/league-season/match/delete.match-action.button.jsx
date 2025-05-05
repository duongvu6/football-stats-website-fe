
import { Button, Popconfirm, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteMatchActionAPI } from "../../../../services/api.service.js";

const DeleteMatchActionButton = ({ matchAction, onSuccess }) => {
    const handleDelete = async () => {
        try {
            await deleteMatchActionAPI(matchAction.id);
            message.success("Match action deleted successfully");
            onSuccess();
        } catch (error) {
            console.error("Error deleting match action:", error);
            message.error("Failed to delete match action");
        }
    };

    return (
        <Popconfirm
            title="Delete match action"
            description={`Are you sure you want to delete this ${matchAction.action.toLowerCase().replace('_', ' ')}?`}
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
        >
            <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
            />
        </Popconfirm>
    );
};

export default DeleteMatchActionButton;