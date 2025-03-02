// epl-web/src/components/admin/transfer-history/edit.transfer.button.jsx
import { Button } from "antd";
import { EditOutlined } from '@ant-design/icons';
import { useState } from "react";
import EditTransferModal from "./edit.transfer.modal.jsx";

const EditTransferButton = ({ player, transfer, onSuccess }) => {
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
            <EditTransferModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                player={player}
                transfer={transfer}
                onSuccess={onSuccess}
            />
        </>
    );
};

export default EditTransferButton;