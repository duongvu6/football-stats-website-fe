
import { Button, Popconfirm, message, notification } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import {deleteClubSeasonTableAPI} from "../../../../services/api.service.js";

const DeleteClubSeasonButton = ({ clubSeason, onSuccess }) => {
    const handleDelete = async () => {
        try {
            const res = await deleteClubSeasonTableAPI(clubSeason.id);

            if (res.status === 200 || res.data) {
                message.success("Club removed from season successfully");
                onSuccess(); // Refresh the data
            } else {
                notification.error({
                    message: "Failed to remove club",
                    description: res.message || "An unknown error occurred"
                });
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: error.message || "Failed to remove club from season"
            });
        }
    };

    return (
        <Popconfirm
            title="Remove Club"
            description={`Are you sure you want to remove ${clubSeason.club?.name} from this season?`}
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

export default DeleteClubSeasonButton;