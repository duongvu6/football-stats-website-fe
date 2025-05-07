
import { useState, useEffect } from "react";
import {Button, Space, Table, Card, Image} from "antd";
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { fetchAllLeaguesAPI } from "../../../services/api.service.js";
import { Link } from "react-router-dom";
import CreateLeagueModal from "./league.create.jsx";
import EditLeagueModal from "./league.edit.jsx";
import DeleteLeagueButton from "./league.delete.jsx";

const AdminLeagueTable = () => {

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentLeague, setCurrentLeague] = useState(null);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [loading, setLoading] = useState(false);

    const fetchData = async (params = {}) => {
        setLoading(true);
        try {
            const response = await fetchAllLeaguesAPI({
                page: params.current || pagination.current,
                size: params.pageSize || pagination.pageSize,
                sort: params.field && params.order ? `${params.field},${params.order === 'ascend' ? 'asc' : 'desc'}` : undefined
            });

            if (response.data && response.data.result) {
                setData(response.data.result);
                setPagination({
                    current: response.data.meta.page,
                    pageSize: response.data.meta.pageSize,
                    total: response.data.meta.total
                });
            } else if (Array.isArray(response.data)) {

                setData(response.data);
                setPagination(prev => ({
                    ...prev,
                    total: response.data.length
                }));
            }
        } catch (error) {
            console.error("Failed to fetch leagues:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTableChange = (newPagination, filters, sorter) => {
        fetchData({
            current: newPagination.current,
            pageSize: newPagination.pageSize,
            field: sorter.field,
            order: sorter.order
        });
    };

    const showCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const showEditModal = (league) => {
        setCurrentLeague(league);
        setIsEditModalOpen(true);
    };

    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        fetchData({ current: 1 });
    };

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        fetchData({ current: pagination.current });
    };

    const handleDeleteSuccess = () => {
        fetchData({ current: pagination.current });
    };

    const columns = [
        {
            title: "#",
            render: (_, __, index) => {
                return (pagination.current - 1) * pagination.pageSize + index + 1;
            },
            width: 60
        },
        {
            title: "ID",
            dataIndex: "id",
        },
        {
            title: "Logo",
            dataIndex: "imageUrl",
            key: "logo",
            width: 80,
            render: (imageUrl) => (
                <Image
                    src={imageUrl}
                    alt="League Logo"
                    width={50}
                    height={50}
                    style={{ objectFit: 'contain' }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCY"
                />
            )
        },
        {
            title: "Name",
            dataIndex: "name",
            render: (text, record) => <Link to={`/admin/leagues/${record.id}`}>{text}</Link>,
            sorter: true
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

    return (
        <>
            <Card
                title="League Table"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showCreateModal}
                    >
                        Add League
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                    }}
                    loading={loading}
                    onChange={handleTableChange}
                />
            </Card>

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