import { Button, message, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteLeagueAPI } from "../../../services/api.service.js";

const DeleteLeagueButton = ({ leagueId, onSuccess }) => {
    const handleDelete = async () => {
        try {
            const res = await deleteLeagueAPI(leagueId);
            if (res.data) {
                message.success("League deleted successfully");
                onSuccess();
            } else {
                message.error("Failed to delete league");
            }
        } catch (error) {
            message.error("An error occurred while deleting the league");
            console.error(error);
        }
    };

    return (
        <Popconfirm
            title="Delete league"
            description="Are you sure you want to delete this league?"
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

export default DeleteLeagueButton;