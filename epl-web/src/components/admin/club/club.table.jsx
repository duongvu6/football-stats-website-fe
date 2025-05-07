import { useState, useEffect } from "react";
import {Button, Space, Table, Card, Image} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { fetchAllClubsWithPaginationAPI } from "../../../services/api.service.js";
import { Link } from "react-router-dom";
import CreateClubModal from "./club.create.jsx";
import EditClubModal from "./club.edit.jsx";
import DeleteClubButton from "./club.delete.jsx";

const AdminClubTable = () => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [loading, setLoading] = useState(false);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentClub, setCurrentClub] = useState(null);

    const fetchData = async (params = {}) => {
        setLoading(true);
        try {
            const response = await fetchAllClubsWithPaginationAPI({
                page: params.current || pagination.current,
                size: params.pageSize || pagination.pageSize,
            });

            if (response.data && response.data.result) {
                setData(response.data.result);
                setPagination({
                    current: response.data.meta.page,
                    pageSize: response.data.meta.pageSize,
                    total: response.data.meta.total,
                });
            }
        } catch (error) {
            console.error("Failed to fetch clubs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTableChange = (newPagination) => {
        fetchData({
            current: newPagination.current,
            pageSize: newPagination.pageSize,
        });
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
            render: (_, __, index) =>
                (pagination.current - 1) * pagination.pageSize + index + 1,
            width: 60,
        },
        {
            title: "ID",
            dataIndex: "id"
        },
        {
            title: "Logo",
            dataIndex: "imageUrl",
            key: "logo",
            width: 70,
            render: (imageUrl) => (
                <Image
                    src={imageUrl}
                    alt="Club Logo"
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
            render: (text, record) => (
                <Link to={`/admin/clubs/${record.id}`}>{text}</Link>
            ),
        },
        {
            title: "Country",
            dataIndex: "country",
        },
        {
            title: "Stadium Name",
            dataIndex: "stadiumName",
        },
        {
            title: "Actions",
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => {
                            setCurrentClub(record);
                            setIsEditModalOpen(true);
                        }}
                    />
                    <DeleteClubButton
                        clubId={record.id}
                        onSuccess={handleDeleteSuccess}
                    />
                </Space>
            ),
        },
    ];

    return (
        <>
            <Card
                title="Club Table"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        Add Club
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
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} items`,
                    }}
                    loading={loading}
                    onChange={handleTableChange}
                />
            </Card>

            <CreateClubModal
                isOpen={isCreateModalOpen}
                onCancel={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            <EditClubModal
                isOpen={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onSuccess={handleEditSuccess}
                club={currentClub}
            />
        </>
    );
};

export default AdminClubTable;