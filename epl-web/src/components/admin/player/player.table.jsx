// epl-web/src/components/admin/player/player.table.jsx
import { useState } from "react";
import { Button, Space } from "antd";
import { EditOutlined } from '@ant-design/icons';
import CreatePlayerModal from "./player.create.jsx";
import EditPlayerModal from "./player.edit.jsx";
import DeletePlayerButton from "./player.delete.jsx";
import BasePlayerTable from "../../shared/player/base.player.table.jsx";
import GenericTableContainer from "../../shared/generic/generic.table.container.jsx";

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
        baseTableProps.loadData();
    };

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        baseTableProps.loadData();
    };

    const handleDeleteSuccess = () => {
        baseTableProps.loadData();
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
    const baseTableProps = BasePlayerTable({
        extraColumns: adminColumns,
        urlPrefix: '/admin/players/',
    });

    return (
        <>
            <GenericTableContainer
                tableProps={baseTableProps.tableProps}
                title="Player Table"
                showAddButton={true}
                onAddClick={showCreateModal}
                addButtonText="Add Player"
            />

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
    );
};

export default AdminPlayerTable;