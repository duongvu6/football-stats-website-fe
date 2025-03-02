// epl-web/src/components/admin/player/player.table.jsx
import { Button, Table, Space } from "antd";
import { useState } from "react";
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import CreatePlayerModal from "./player.create.jsx";
import EditPlayerModal from "./player.edit.jsx";
import DeletePlayerButton from "./player.delete.jsx";
import PlayerBaseTable from "../../shared/player/base.player.table.jsx";

const AdminPlayerTable = () => {
    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState(null);

    const showCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const showEditModal = (player) => {
        setCurrentPlayer(player);
        setIsEditModalOpen(true);
    };

    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        baseTableProps.loadPlayers();
    };

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        baseTableProps.loadPlayers();
    };

    const handleDeleteSuccess = () => {
        baseTableProps.loadPlayers();
    };

    const adminColumns = [
        {
            title: "ID",
            dataIndex: "id",
        },
        {
            title: "Actions",
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => showEditModal(record)}
                    />
                    <DeletePlayerButton
                        playerId={record.id}
                        onSuccess={handleDeleteSuccess}
                    />
                </Space>
            ),
        },
    ];

    // Use the base table with correct URL prefix for admin
    const baseTableProps = PlayerBaseTable({
        extraColumns: adminColumns,
        urlPrefix: '/admin/players/',  // Note the trailing slash to ensure proper URL formatting
    });

    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "10px",
                marginBottom: "10px"
            }}>
                <h3>Player Table</h3>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showCreateModal}
                >
                    Add Player
                </Button>
            </div>

            <Table {...baseTableProps.tableProps} />

            {/* Create Player Modal */}
            <CreatePlayerModal
                isOpen={isCreateModalOpen}
                onCancel={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            {/* Edit Player Modal */}
            <EditPlayerModal
                isOpen={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onSuccess={handleEditSuccess}
                player={currentPlayer}
            />
        </>
    )
}

export default AdminPlayerTable;