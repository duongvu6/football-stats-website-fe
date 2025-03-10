import { useState } from "react";
import { Button, Space } from "antd";
import { EditOutlined } from '@ant-design/icons';
import BaseLeagueTable from "../../shared/league/base.league.table";
import CreateLeagueModal from "./league.create.jsx";
import EditLeagueModal from "./league.edit.jsx";
import DeleteLeagueButton from "./league.delete.jsx";
import GenericTableContainer from "../../shared/generic/generic.table.container.jsx";

const AdminLeagueTable = () => {
    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentLeague, setCurrentLeague] = useState(null);

    const showCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const showEditModal = (league) => {
        setCurrentLeague(league);
        setIsEditModalOpen(true);
    };

    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        baseTableProps.loadData(true);
    };

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        baseTableProps.loadData(true);
    };

    const handleDeleteSuccess = () => {
        baseTableProps.loadData(true);
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
                    <DeleteLeagueButton
                        leagueId={record.id}
                        onSuccess={handleDeleteSuccess}
                    />
                </Space>
            ),
        },
    ];

    const baseTableProps = BaseLeagueTable({
        extraColumns: adminColumns,
        urlPrefix: '/admin/leagues/',
    });

    return (
        <>
            <GenericTableContainer
                tableProps={baseTableProps.tableProps}
                title="League Table"
                showAddButton={true}
                onAddClick={showCreateModal}
                addButtonText="Add League"
            />

            <CreateLeagueModal
                isOpen={isCreateModalOpen}
                onCancel={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            <EditLeagueModal
                isOpen={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onSuccess={handleEditSuccess}
                league={currentLeague}
            />
        </>
    );
};

export default AdminLeagueTable;