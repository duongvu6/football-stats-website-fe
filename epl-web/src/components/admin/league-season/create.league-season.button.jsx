// epl-web/src/components/admin/league-season/create.league-season.button.jsx
import { Button } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { useState } from "react";
import CreateLeagueSeasonModal from "./create.league-season.modal.jsx";

const CreateLeagueSeasonButton = ({ league, onSuccess }) => {
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
                Add Season
            </Button>
            <CreateLeagueSeasonModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                league={league}
                onSuccess={onSuccess}
            />
        </>
    );
};

export default CreateLeagueSeasonButton;