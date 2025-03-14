import { useState } from "react";
import { Button, Space, Table, Card } from "antd";
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import CreatePlayerModal from "./player.create.jsx";
import EditPlayerModal from "./player.edit.jsx";
import DeletePlayerButton from "./player.delete.jsx";
import { fetchAllPlayersAPI } from "../../../services/api.service.js";
import { Link } from "react-router-dom";

const AdminPlayerTable = () => {
    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [loading, setLoading] = useState(false);

    // Fetch data function
    const fetchData = async (params = {}) => {
        setLoading(true);
        try {
            const response = await fetchAllPlayersAPI({
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
            }
        } catch (error) {
            console.error("Failed to fetch players:", error);
        } finally {
            setLoading(false);
        }
    };

    // Load data initially
    useState(() => {
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

    const showEditModal = (player) => {
        setCurrentPlayer(player);
        setIsEditModalOpen(true);
    };

    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        fetchData({ current: 1 }); // Go to first page to see new item
    };

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        fetchData({ current: pagination.current }); // Stay on current page
    };

    const handleDeleteSuccess = () => {
        fetchData({ current: pagination.current }); // Stay on current page
    };

    // Table columns
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
            title: "Name",
            dataIndex: "name",
            render: (text, record) => <Link to={`/admin/players/${record.id}`}>{text}</Link>,
            sorter: true
        },
        {
            title: "Age",
            dataIndex: "age",
            sorter: true
        },
        {
            title: "Shirt Number",
            dataIndex: "shirtNumber",
            sorter: true
        },
        {
            title: "Citizenship",
            dataIndex: "citizenships",
            render: (citizenships) => {
                return Array.isArray(citizenships) ? citizenships.join(', ') : citizenships;
            },
            sorter: true
        },
        {
            title: "Position",
            dataIndex: "positions",
            render: (positions) => {
                return Array.isArray(positions) ? positions.join(', ') : positions;
            },
            sorter: true
        },
        {
            title: "Current Club",
            dataIndex: "currentClub",
            sorter: (a, b) => {
                const aClub = a.currentClub || '';
                const bClub = b.currentClub || '';

                // Properly return the comparison result
                return aClub.localeCompare(bClub);
            }
        },
        {
            title: "Market Value(millions Euro)",
            dataIndex: "marketValue",
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
                    <DeletePlayerButton
                        playerId={record.id}
                        onSuccess={handleDeleteSuccess}
                    />
                </Space>
            ),
        },
    ];

    return (
        <>
            <Card
                title="Player Table"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showCreateModal}
                    >
                        Add Player
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

            <CreatePlayerModal
                isOpen={isCreateModalOpen}
                onCancel={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

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