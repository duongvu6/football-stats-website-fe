
import { Button, Form, Modal, Select, InputNumber, message, notification } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import {
    updateMatchActionAPI,
    fetchAllPlayersAPI,
    fetchAllPlayersNoPaginationAPI
} from "../../../../services/api.service.js";

const EditMatchActionButton = ({ matchAction, match, onSuccess }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [players, setPlayers] = useState([]);
    const [loadingPlayers, setLoadingPlayers] = useState(false);

    const showModal = () => {
        setIsOpen(true);
        loadPlayers();
    };

    useEffect(() => {
        if (isOpen && matchAction) {

            form.setFieldsValue({
                action: matchAction.action,
                minute: matchAction.minute,
                player: matchAction.player.id
            });
        }
    }, [isOpen, matchAction, form]);

    const loadPlayers = async () => {
        setLoadingPlayers(true);
        try {

            const res = await fetchAllPlayersNoPaginationAPI();

            if (res.data) {
                console.log("Players API response:", res.data);

                const allPlayers = Array.isArray(res.data)
                    ? res.data
                    : (res.data.result || []);

                const hostClubId = match.host.id;
                const hostClubName = match.host.name;
                const awayClubId = match.away.id;
                const awayClubName = match.away.name;

                console.log(`Host club: ${hostClubName} (${hostClubId}), Away club: ${awayClubName} (${awayClubId})`);

                const matchPlayers = allPlayers.filter(player => {
                    if (!player.transferHistories || !player.transferHistories.length) {
                        return false;
                    }

                    const latestTransfer = player.transferHistories[0];
                    let playerClub = latestTransfer.club;

                    if (typeof playerClub === 'object' && playerClub) {

                        return playerClub.id === hostClubId || playerClub.id === awayClubId ||
                            playerClub.name === hostClubName || playerClub.name === awayClubName;
                    }

                    if (typeof playerClub === 'string') {

                        return playerClub === hostClubName || playerClub === awayClubName ||
                            hostClubName.includes(playerClub) || awayClubName.includes(playerClub) ||
                            playerClub.includes(hostClubName) || playerClub.includes(awayClubName);
                    }

                    return false;
                });

                console.log(`Found ${matchPlayers.length} players matching the clubs`);

                const formattedPlayers = matchPlayers.map(player => {
                    const latestTransfer = player.transferHistories[0];
                    let playerClub = latestTransfer.club;
                    let clubName, isHomeTeam;

                    if (typeof playerClub === 'object' && playerClub) {
                        clubName = playerClub.name;
                        isHomeTeam = playerClub.id === hostClubId || playerClub.name === hostClubName;
                    } else if (typeof playerClub === 'string') {

                        isHomeTeam = playerClub === hostClubName ||
                            hostClubName.includes(playerClub) ||
                            playerClub.includes(hostClubName);

                        clubName = isHomeTeam ? hostClubName : awayClubName;
                    }

                    return {
                        label: `${player.name} (${clubName || playerClub || 'Unknown Club'})`,
                        value: player.id,
                        club: isHomeTeam ? hostClubId : awayClubId
                    };
                });

                setPlayers(formattedPlayers);
            }
        } catch (error) {
            console.error("Error loading players:", error);
            notification.error({
                message: "Error loading players",
                description: "Could not load players for this match"
            });
        } finally {
            setLoadingPlayers(false);
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            const updatedAction = {
                id: matchAction.id,
                match: match.id,
                player: values.player,
                action: values.action,
                minute: values.minute
            };

            const res = await updateMatchActionAPI(updatedAction);

            if (res.data) {
                message.success("Match action updated successfully");
                setIsOpen(false);
                onSuccess();
            } else {
                message.error("Failed to update match action");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            notification.error({
                message: "Form validation error",
                description: error.message || "Please check form fields"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                onClick={showModal}
            />
            <Modal
                title="Edit Match Action"
                open={isOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={loading}
                        onClick={handleSubmit}
                    >
                        Update
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="action"
                        label="Action Type"
                        rules={[{ required: true, message: "Please select an action type" }]}
                    >
                        <Select>
                            <Select.Option value="GOAL">Goal</Select.Option>
                            <Select.Option value="OWN_GOAL">Own Goal</Select.Option>
                            <Select.Option value="YELLOW_CARD">Yellow Card</Select.Option>
                            <Select.Option value="RED_CARD">Red Card</Select.Option>
                            <Select.Option value="ASSIST">Assist</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="minute"
                        label="Minute"
                        rules={[{ required: true, message: "Please enter the minute" }]}
                    >
                        <InputNumber min={1} max={120} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        name="player"
                        label="Player"
                        rules={[{ required: true, message: "Please select a player" }]}
                    >
                        <Select
                            loading={loadingPlayers}
                            options={players}
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default EditMatchActionButton;