
import { Button, Popconfirm, message, notification } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import { deleteCoachClubAPI } from "../../../services/api.service.js";

const DeleteCoachClubButton = ({ coachClub, onSuccess }) => {
    const handleDelete = async () => {
        try {
            const res = await deleteCoachClubAPI(coachClub.id);

            if (res.status === 200 || res.data) {
                message.success("Club history deleted successfully");
                onSuccess();
            } else {
                notification.error({
                    message: "Failed to delete club history",
                    description: JSON.stringify(res.message)
                });
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: error.message || "Failed to delete club history"
            });
        }
    };

    return (
        <Popconfirm
            title="Delete Club History"
            description="Are you sure you want to delete this club history?"
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

export default DeleteCoachClubButton;