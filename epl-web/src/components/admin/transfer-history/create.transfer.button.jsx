import {Button, Form, message, Modal} from "antd";
import { PlusOutlined } from '@ant-design/icons';
import {useState} from "react";
import CreateTransferModal from "./create.transfer.modal.jsx";

const CreateTransferButton = ({ player, onSuccess }) => {
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
                Add Transfer
            </Button>
            <CreateTransferModal isOpen={isOpen} setIsOpen={setIsOpen} player={player} onSuccess={onSuccess}/>
        </>

    );
};

export default CreateTransferButton;