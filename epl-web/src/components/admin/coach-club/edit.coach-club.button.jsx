
import { Button } from "antd";
import { EditOutlined } from '@ant-design/icons';
import { useState } from "react";
import EditCoachClubModal from "./edit.coach-club.modal.jsx";

const EditCoachClubButton = ({ coach, coachClub, onSuccess }) => {
    const [isOpen, setIsOpen] = useState(false);

    const onOpen = () => {
        setIsOpen(true);
    };

    return (
        <>
            <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                onClick={onOpen}
            />
            <EditCoachClubModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                coach={coach}
                coachClub={coachClub}
                onSuccess={onSuccess}
            />
        </>
    );
};

export default EditCoachClubButton;