import {deleteCoachAPI} from "../../../services/api.service.js";
import {Button, message, Popconfirm} from "antd";
import {DeleteOutlined} from "@ant-design/icons";

const DeleteCoachButton = ({ coachId, onSuccess }) => {
    const handleDelete = async () => {
        try {
            const res = await deleteCoachAPI(coachId);
            if (res.data) {
                message.success("Coach deleted successfully");

                onSuccess();
            } else {
                message.error("Failed to delete player");
            }
        } catch (error) {
            message.error("An error occurred while deleting the coach");
            console.error(error);
        }
    };

    return (
        <Popconfirm
            title="Delete coach"
            description="Are you sure you want to delete this coach?"
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

export default DeleteCoachButton;