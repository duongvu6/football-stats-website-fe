import { Button } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { useState } from "react";
import CreateMatchModal from "./create.match.modal.jsx";

const CreateMatchButton = ({ leagueSeason, onSuccess }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showModal}
            >
                Add Match
            </Button>
            <CreateMatchModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                leagueSeason={leagueSeason}
                onSuccess={onSuccess}
            />
        </>
    );
};

export default CreateMatchButton;