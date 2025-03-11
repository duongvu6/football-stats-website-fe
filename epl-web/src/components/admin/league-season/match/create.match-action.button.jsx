// epl-web/src/components/admin/match/create.match-action.button.jsx
import { Button, Form, Modal, Select, InputNumber, message } from "antd";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {fetchPlayersFromClubsAPI} from "../../../../services/api.service.js";

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
            // Fetch players from both clubs
            const res = await fetchPlayersFromClubsAPI([match.host.id, match.away.id]);
            if (res.data) {
                // Format players for the dropdown
                const formattedPlayers = res.data.map(player => ({
                    label: `${player.name} (${player.club.name})`,
                    value: player.id,
                    club: player.club.id
                }));
                setPlayers(formattedPlayers);
            }
        } catch (error) {
            console.error("Error loading players:", error);
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
            message.error("Please check form fields");
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
                            <Select.Option value="SUBSTITUTION">Substitution</Select.Option>
                            <Select.Option value="PENALTY_MISSED">Penalty Missed</Select.Option>
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