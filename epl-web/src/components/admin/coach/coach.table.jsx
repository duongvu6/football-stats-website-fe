import BaseCoachTable from "../../shared/coach/base.coach.table";
import GenericTableContainer from "../../shared/generic/generic.table.container";

import {useState} from "react";
import CreateCoachModal from "./coach.create.jsx";
import EditCoachModal from "./coach.edit.jsx";
import {Button, Space} from "antd";
import {EditOutlined} from "@ant-design/icons";
import DeletePlayerButton from "../player/player.delete.jsx";
import DeleteCoachButton from "./coach.delete.jsx";

const AdminCoachTable = () => {
    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentCoach, setCurrentCoach] = useState(null);

    const showCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const showEditModal = (coach) => {
        setCurrentCoach(coach);
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
                    <DeleteCoachButton
                        coachId={record.id}
                        onSuccess={handleDeleteSuccess}
                    />
                </Space>
            ),
        },
    ];
    const baseTableProps = BaseCoachTable({
        extraColumns: adminColumns,
        urlPrefix: '/admin/coaches/',
    });

    return (
        <>
            <GenericTableContainer
                tableProps={baseTableProps.tableProps}
                title="Head Coach Table"
                showAddButton={true}
                onAddClick={showCreateModal}
                addButtonText="Add Coach"
            />
            {/* Create Player Modal */}
            <CreateCoachModal
                isOpen={isCreateModalOpen}
                onCancel={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            {/* Edit Player Modal */}
            <EditCoachModal
                isOpen={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onSuccess={handleEditSuccess}
                coach={currentCoach}
            />
        </>

    );
};
export default AdminCoachTable;