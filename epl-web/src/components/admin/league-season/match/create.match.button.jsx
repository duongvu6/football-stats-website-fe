// epl-web/src/components/admin/match/create.match-action.button.jsx
import { Button, Form, Modal, Select, InputNumber, message, notification } from "antd";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {createMatchActionAPI, fetchAllPlayersAPI} from "../../../../services/api.service.js";

const CreateMatchActionButton = ({ match, onSuccess }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [players, setPlayers] = useState([]);
    const [loadingPlayers, setLoadingPlayers] = useState(false);

    const showModal = async () => {
        setIsOpen(true);
        loadPlayers();
    };

    const loadPlayers = async () => {
        setLoadingPlayers(true);
        try {
            // Get all players and filter by those in clubs involved in the match
            const res = await fetchAllPlayersAPI();
            if (res.data && res.data.result) {
                // Filter players from relevant clubs
                const allPlayers = res.data.result;
                const matchPlayers = allPlayers.filter(player => {
                    if (!player.transferHistories || player.transferHistories.length === 0) return false;
                    const clubId = typeof player.transferHistories[0].club === 'object'
                        ? player.transferHistories[0].club.id
                        : player.transferHistories[0].club;
                    return clubId === match.host.id || clubId === match.away.id;
                });

                // Format players for the dropdown
                const formattedPlayers = matchPlayers.map(player => {
                    const clubId = typeof player.transferHistories[0].club === 'object'
                        ? player.transferHistories[0].club.id
                        : player.transferHistories[0].club;
                    const clubName = typeof player.transferHistories[0].club === 'object'
                        ? player.transferHistories[0].club.name
                        : (clubId === match.host.id ? match.host.name : match.away.name);

                    return {
                        label: `${player.name} (${clubName})`,
                        value: player.id,
                        club: clubId
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
        form.resetFields();
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            const matchAction = {
                match: match.id,
                player: values.player,
                action: values.action,
                minute: values.minute
            };

            const res = await createMatchActionAPI(matchAction);

            if (res.data) {
                message.success("Match action added successfully");
                handleCancel();
                onSuccess();
            } else {
                message.error("Failed to add match action");
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
                icon={<PlusOutlined />}
                onClick={showModal}
            >
                Add Action
            </Button>
            <Modal
                title="Add Match Action"
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
                        Add
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

export default CreateMatchActionButton;