// epl-web/src/components/admin/league-season/club-season/add.club-to-season.button.jsx
import { Button } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { useState } from "react";
import AddClubToSeasonModal from "./add.club-to-season.modal.jsx";

const AddClubToSeasonButton = ({ leagueSeason, onSuccess }) => {
    const [isOpen, setIsOpen] = useState(false);

    const onOpen = () => {
        setIsOpen(true);
    };

    return (
        <>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onOpen}
            >
                Add Club
            </Button>
            <AddClubToSeasonModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                leagueSeason={leagueSeason}
                onSuccess={onSuccess}
            />
        </>
    );
};

export default AddClubToSeasonButton;