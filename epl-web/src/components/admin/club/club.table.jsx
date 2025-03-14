// epl-web/src/components/admin/club/club.table.jsx
import { useState, useEffect } from "react";
import { Button, Space, Table, Card } from "antd";
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { fetchAllClubsWithPaginationAPI } from "../../../services/api.service.js";
import { Link } from "react-router-dom";

const AdminClubTable = () => {
    // State variables
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
            const response = await fetchAllClubsWithPaginationAPI({
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
            console.error("Failed to fetch clubs:", error);
        } finally {
            setLoading(false);
        }
    };

    // Load data initially
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
            render: (text, record) => <Link to={`/admin/clubs/${record.id}`}>{text}</Link>,
            sorter: true
        },
        {
            title: "Country",
            dataIndex: "country",
            sorter: true
        },
        {
            title: "Stadium Name",
            dataIndex: "stadiumName",
            sorter: true
        }
    ];

    return (
        <Card title="Club Table">
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
    );
};

export default AdminClubTable;