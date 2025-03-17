// epl-web/src/components/admin/player/player.table.jsx
import { useState, useEffect } from "react";
import { Button, Space, Table, Card } from "antd";
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { fetchAllPlayersAPI } from "../../../services/api.service.js";
import CreatePlayerModal from "./player.create.jsx";
import EditPlayerModal from "./player.edit.jsx";
import DeletePlayerButton from "./player.delete.jsx";

const AdminPlayerTable = () => {
    // State variables
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState(null);

    // Load players when component mounts
    useEffect(() => {
        loadPlayers();
    }, []);

    // Function to load players from API
    const loadPlayers = async (page = pagination.current, pageSize = pagination.pageSize) => {
        setLoading(true);
        try {
            const response = await fetchAllPlayersAPI({
                page: page,
                size: pageSize
            });

            if (response.data && response.data.result) {
                setPlayers(response.data.result);
                setPagination({
                    ...pagination,
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

    // Handle table pagination or sorting change
    const handleTableChange = (newPagination) => {
        loadPlayers(newPagination.current, newPagination.pageSize);
    };

    // Open create player modal
    const showCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    // Open edit player modal
    const showEditModal = (player) => {
        setCurrentPlayer(player);
        setIsEditModalOpen(true);
    };

    // After successfully creating a player
    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        loadPlayers(1); // Go to first page to see new player
    };

    // After successfully editing a player
    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        loadPlayers(pagination.current); // Reload current page
    };

    // After successfully deleting a player
    const handleDeleteSuccess = () => {
        loadPlayers(pagination.current); // Reload current page
    };

    // Table columns configuration
    const columns = [
        {
            title: "#",
            render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
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
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: "Age",
            dataIndex: "age",
            sorter: (a, b) => a.age - b.age
        },
        {
            title: "Shirt Number",
            dataIndex: "shirtNumber",
            sorter: (a, b) => (a.shirtNumber || 0) - (b.shirtNumber || 0)
        },
        {
            title: "Citizenship",
            dataIndex: "citizenships",
            render: (citizenships) => Array.isArray(citizenships) ? citizenships.join(', ') : citizenships,
            sorter: (a, b) => {
                const aStr = Array.isArray(a.citizenships) ? a.citizenships.join(', ') : '';
                const bStr = Array.isArray(b.citizenships) ? b.citizenships.join(', ') : '';
                return aStr.localeCompare(bStr);
            }
        },
        {
            title: "Position",
            dataIndex: "positions",
            render: (positions) => Array.isArray(positions) ? positions.join(', ') : positions,
            sorter: (a, b) => {
                const aStr = Array.isArray(a.positions) ? a.positions.join(', ') : '';
                const bStr = Array.isArray(b.positions) ? b.positions.join(', ') : '';
                return aStr.localeCompare(bStr);
            }
        },
        {
            title: "Current Club",
            dataIndex: "currentClub",
            sorter: (a, b) => {
                const aClub = a.currentClub || '';
                const bClub = b.currentClub || '';
                return aClub.localeCompare(bClub);
            }
        },
        {
            title: "Market Value(millions Euro)",
            dataIndex: "marketValue",
            sorter: (a, b) => (a.marketValue || 0) - (b.marketValue || 0)
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
                    dataSource={players}
                    rowKey="id"
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
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