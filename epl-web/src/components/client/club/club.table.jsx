import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Table, Card, Alert, Button, Tag } from "antd";
import { fetchAllClubsWithPaginationAPI } from "../../../services/api.service.js";

const ClientClubTable = () => {
    const [searchParams] = useSearchParams();
    const [filterInfo, setFilterInfo] = useState(null);
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // Extract filter parameters from URL
    const country = searchParams.get('country');

    // Determine if we have any filters active
    useEffect(() => {
        if (country) {
            setFilterInfo(`Filtering by: Country "${country}"`);
        } else {
            setFilterInfo(null);
        }
    }, [country]);

    const fetchClubs = async (params = {}) => {
        setLoading(true);
        try {
            // Build Spring Filter compliant filter string
            let filterParts = [];

            if (country) {
                filterParts.push(`country : '${country}'`);
            }

            // API query parameters
            const queryParams = {
                page: params.current || pagination.current,
                size: params.pageSize || pagination.pageSize,
                filter: filterParts.length > 0 ? filterParts.join(' and ') : undefined
            };

            const response = await fetchAllClubsWithPaginationAPI(queryParams);

            if (response.data && response.data.result) {
                setClubs(response.data.result);
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

    useEffect(() => {
        fetchClubs();
    }, [country]);

    // Handle pagination changes
    const handleTableChange = (newPagination, filters, sorter) => {
        // Only fetch new data when pagination changes
        if (newPagination.current !== pagination.current ||
            newPagination.pageSize !== pagination.pageSize) {
            fetchClubs({
                current: newPagination.current,
                pageSize: newPagination.pageSize
            });
        }
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text, record) => <Link to={`/clubs/${record.id}`}>{text}</Link>,
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: "Country",
            dataIndex: "country",
            key: "country",
            render: (country) => (
                <Tag color="blue">
                    <Link to={`/clubs?country=${encodeURIComponent(country)}`}>
                        {country}
                    </Link>
                </Tag>
            ),
            sorter: (a, b) => a.country.localeCompare(b.country)
        },
        {
            title: "Stadium",
            dataIndex: "stadiumName",
            key: "stadiumName",
            sorter: (a, b) => a.stadiumName.localeCompare(b.stadiumName)
        }
    ];

    return (
        <>
            {filterInfo && (
                <Card style={{ marginBottom: 16 }}>
                    <Alert
                        message={filterInfo}
                        type="info"
                        showIcon
                        action={
                            <Button type="link" href="/clubs">Clear filters</Button>
                        }
                    />
                </Card>
            )}
            <Card title="Club Table">
                <Table
                    columns={columns}
                    dataSource={clubs}
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
        </>
    );
};

export default ClientClubTable;