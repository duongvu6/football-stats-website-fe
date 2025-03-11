// epl-web/src/components/admin/league-season/edit.league-season.button.jsx
import { Button } from "antd";
import { EditOutlined } from '@ant-design/icons';
import { useState } from "react";
import EditLeagueSeasonModal from "./edit.league-season.modal.jsx";

const EditLeagueSeasonButton = ({ league, leagueSeason, onSuccess }) => {
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
            <EditLeagueSeasonModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                league={league}
                leagueSeason={leagueSeason}
                onSuccess={onSuccess}
            />
        </>
    );
};

export default EditLeagueSeasonButton;