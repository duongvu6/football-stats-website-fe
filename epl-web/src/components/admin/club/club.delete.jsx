import {Button, Popconfirm, message, notification} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteClubAPI } from "../../../services/api.service.js";

const DeleteClubButton = ({ clubId, onSuccess }) => {
    const handleDelete = async () => {
        try {
            const res = await deleteClubAPI(clubId);
            if (res.data) {
                message.success("Club deleted successfully");
                onSuccess();
            } else {
                message.error("Failed to delete club");
            }
        } catch (error) {
            console.error("Error deleting club:", error);
            notification.error({
                description: "An error occurred while deleting the club",
                message: error.message
            });
        }
    };

    return (
        <Popconfirm
            title="Delete Club"
            description="Are you sure you want to delete this club?"
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

export default DeleteClubButton;