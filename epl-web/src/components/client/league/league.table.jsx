import { useState, useEffect } from "react";
import {Table, Card, Image} from "antd";
import { Link } from "react-router-dom";
import { fetchAllLeaguesAPI } from "../../../services/api.service.js";

const ClientLeagueTable = () => {
    const [leagues, setLeagues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const fetchLeagues = async (params = {}) => {
        setLoading(true);
        try {
            const response = await fetchAllLeaguesAPI({
                page: params.current || pagination.current,
                size: params.pageSize || pagination.pageSize
            });

            if (response.data && response.data.result) {
                setLeagues(response.data.result);
                setPagination({
                    current: response.data.meta.page,
                    pageSize: response.data.meta.pageSize,
                    total: response.data.meta.total
                });
            } else if (Array.isArray(response.data)) {
                
                setLeagues(response.data);
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
        fetchLeagues();
    }, []);

    const handleTableChange = (newPagination, filters, sorter) => {
        
        if (newPagination.current !== pagination.current ||
            newPagination.pageSize !== pagination.pageSize) {
            fetchLeagues({
                current: newPagination.current,
                pageSize: newPagination.pageSize
            });
        }
    };

    const columns = [
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
            title: "League",
            dataIndex: "name",
            key: "name",
            render: (text, record) => <Link to={`/leagues/${record.id}`}>{text}</Link>,
            sorter: (a, b) => a.name.localeCompare(b.name)
        }
    ];

    return (
        <Card title="League Table">
            <Table
                columns={columns}
                dataSource={leagues}
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
    );
};

export default ClientLeagueTable;