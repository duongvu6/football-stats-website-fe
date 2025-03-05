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
        // For create, we might want to go to the last page where new item is added
        // But since we don't know which page that is, let's just reload current page
        baseTableProps.loadData(true); // true means keep current page
    };

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        // For edit, we definitely want to keep the user on the same page
        baseTableProps.loadData(true); // true means keep current page
    };

    const handleDeleteSuccess = () => {
        // For delete, we might want to go to previous page if this was the last item
        // But for simplicity, just stay on current page
        baseTableProps.loadData(true); // true means keep current page
    };

    // Define adminColumns BEFORE using it in BasePlayerTable
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

    // Use the base table with correct URL prefix for admin - AFTER adminColumns is defined
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