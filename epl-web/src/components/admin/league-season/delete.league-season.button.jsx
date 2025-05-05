
import { Button, Popconfirm, message, notification } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import { deleteLeagueSeasonAPI } from "../../../services/api.service.js";

const DeleteLeagueSeasonButton = ({ league, leagueSeason, onSuccess }) => {
    const handleDelete = async () => {
        try {
            const res = await deleteLeagueSeasonAPI(leagueSeason.id);

            if (res.status === 200 || res.data) {
                message.success("Season deleted successfully");
                onSuccess();
            } else {
                notification.error({
                    message: "Failed to delete season",
                    description: res.message || "An unknown error occurred"
                });
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: error.message || "Failed to delete season"
            });
        }
    };

    return (
        <Popconfirm
            title="Delete Season"
            description="Are you sure you want to delete this season?"
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

export default DeleteLeagueSeasonButton;