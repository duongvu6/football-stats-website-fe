
import { Button } from "antd";
import { EditOutlined } from '@ant-design/icons';
import { useState } from "react";
import EditMatchModal from "./edit.match.modal.jsx";

const EditMatchButton = ({ match, onSuccess }) => {
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
            <EditMatchModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                match={match}
                onSuccess={onSuccess}
            />
        </>
    );
};

export default EditMatchButton;