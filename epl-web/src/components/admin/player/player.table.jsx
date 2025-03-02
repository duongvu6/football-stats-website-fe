import { Button, Table, Space } from "antd";
import { useEffect, useState } from "react";
import { fetchAllPlayersAPI } from "../../../services/api.service.js";
import { Link } from "react-router-dom";
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import CreatePlayerModal from "./player.create.jsx";
import EditPlayerModal from "./player.edit.jsx";
import DeletePlayerButton from "./player.delete.jsx";

const AdminPlayerTable = () => {
    const [playerData, setPlayerData] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [loadingTable, setLoadingTable] = useState(false);

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState(null);

    useEffect(() => {
        loadPlayers();
    }, [current, pageSize]);

    const loadPlayers = async () => {
        if (current && pageSize) {
            setLoadingTable(true);
            const res = await fetchAllPlayersAPI(current, pageSize);
            if (res.data) {
                setPlayerData(res.data.result);
                setCurrent(res.data.meta?.page || current);
                setPageSize(res.data.meta?.pageSize || pageSize);
                setTotal(res.data.meta?.total || 0);
            }
            setLoadingTable(false);
        }
    }

    const showCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const showEditModal = (player) => {
        setCurrentPlayer(player);
        setIsEditModalOpen(true);
    };

    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        loadPlayers();
    };

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        loadPlayers();
    };

    const handleDeleteSuccess = () => {
        loadPlayers();
    };

    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current) {
            if (Number(pagination.current) !== Number(current)) {
                setCurrent(Number(pagination.current));
            }
        }

        if (pagination && pagination.pageSize) {
            if (Number(pagination.pageSize) !== Number(pageSize)) {
                setPageSize(Number(pagination.pageSize));
                setCurrent(1); // Reset to first page when changing page size
            }
        }
    };

    const columns = [
        {
            title: "#",
            render: (_, record, index) => {
                const calculatedIndex = (Number(current) - 1) * Number(pageSize) + index + 1;
                return isNaN(calculatedIndex) ? index + 1 : calculatedIndex;
            }
        },
        {
            title: "ID",
            dataIndex: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
            render: (text, record) => (
                <Link to={`${record.id}`}>{text}</Link>
            ),
        },
        {
            title: "Age",
            dataIndex: "age",
        },
        {
            title: "Shirt Number",
            dataIndex: "shirtNumber",
        },
        {
            title: "Citizenship",
            dataIndex: "citizenships",
            render: (citizenships) => {
                return Array.isArray(citizenships) ? citizenships.join(', ') : citizenships;
            }
        },
        {
            title: "Position",
            dataIndex: "positions",
            render: (positions) => {
                return Array.isArray(positions) ? positions.join(', ') : positions;
            }
        },
        {
            title: "Current Club",
            render: (_, record) => {
                return record.transferHistories && record.transferHistories[0] ?
                    record.transferHistories[0].club : "No information"
            }
        },
        {
            title: "Market Value(millions Euro)",
            dataIndex: "marketValue",
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
            <Table
                columns={columns}
                dataSource={playerData}
                rowKey={"id"}
                pagination={{
                    current: current,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    total: total,
                    showTotal: (total, range) => {
                        return (<div>{range[0]}-{range[1]} of {total} rows</div>)
                    },
                    pageSizeOptions: ['5', '10', '20', '50', '100']
                }}
                onChange={onChange}
                loading={loadingTable}
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
    )
}

export default AdminPlayerTable;