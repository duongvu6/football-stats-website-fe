
import { useState } from "react";
import { Button } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import CreateTransferModal from "./create.transfer.modal.jsx";

const CreateTransferButton = ({ player, onSuccess }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalOpen(true)}
            >
                Add Transfer
            </Button>

            <CreateTransferModal
                player={player}
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                onSuccess={onSuccess}
            />
        </>
    );
};

export default CreateTransferButton;