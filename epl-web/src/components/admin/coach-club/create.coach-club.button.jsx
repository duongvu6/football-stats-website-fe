
import { Button } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { useState } from "react";
import CreateCoachClubModal from "./create.coach-club.modal.jsx";

const CreateCoachClubButton = ({ coach, onSuccess }) => {
    const [isOpen, setIsOpen] = useState(false);
    const onOpen = () => {
        setIsOpen(true);
    }

    return (
        <>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onOpen}
            >
                Add Club History
            </Button>
            <CreateCoachClubModal isOpen={isOpen} setIsOpen={setIsOpen} coach={coach} onSuccess={onSuccess}/>
        </>
    );
};

export default CreateCoachClubButton;