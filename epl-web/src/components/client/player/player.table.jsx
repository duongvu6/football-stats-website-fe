
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {Table, Card, Alert, Button, Tag, Image} from "antd";
import { fetchAllPlayersAPI } from "../../../services/api.service.js";

const ClientPlayerTable = () => {

    const [searchParams] = useSearchParams();
    const position = searchParams.get('position');
    const citizenship = searchParams.get('citizenship');
    const transferType = searchParams.get('transferType');
    const club = searchParams.get('club');

    const [filterInfo, setFilterInfo] = useState(null);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    useEffect(() => {
        if (position || citizenship || transferType || club) {
            let filterText = "Filtering by: ";
            let filters = [];

            if (position) filters.push(`Position "${position}"`);
            if (citizenship) filters.push(`Nationality "${citizenship}"`);
            if (transferType) filters.push(`Transfer Type "${transferType}"`);
            if (club) filters.push(`Club "${club}"`);

            setFilterInfo(filterText + filters.join(", "));
        } else {
            setFilterInfo(null);
        }
    }, [position, citizenship, transferType, club]);

    const fetchPlayers = async (params = {}) => {
        setLoading(true);
        try {

            let filterParts = [];

            if (position) {
                filterParts.push(`positions : '${position}'`);
            }

            if (citizenship) {
                filterParts.push(`citizenships : '${citizenship}'`);
            }

            if (transferType) {
                filterParts.push(`transferHistories.type : '${transferType}'`);
            }

            if (club) {
                filterParts.push(`transferHistories.club.id : ${club}`);
            }

            const queryParams = {
                page: params.current || pagination.current,
                size: params.pageSize || pagination.pageSize,
                filter: filterParts.length > 0 ? filterParts.join(' and ') : undefined
            };

            const response = await fetchAllPlayersAPI(queryParams);

            if (response.data && response.data.result) {
                setPlayers(response.data.result);
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

    useEffect(() => {
        fetchPlayers();
    }, [position, citizenship, transferType, club]);

    const handleTableChange = (newPagination) => {
        if (newPagination.current !== pagination.current ||
            newPagination.pageSize !== pagination.pageSize) {
            fetchPlayers({
                current: newPagination.current,
                pageSize: newPagination.pageSize
            });
        }
    };

    const columns = [
        {
            title: "#",
            render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
            width: 60
        },
        {
            title: "Image",
            dataIndex: "imageUrl",
            key: "image",
            width: 80,
            render: (imageUrl) => (
                <Image
                    src={imageUrl}
                    alt="Player"
                    width={50}
                    height={50}
                    style={{ objectFit: 'cover', borderRadius: '50%' }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCY"
                />
            )
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text, record) => <Link to={`/players/${record.id}`}>{text}</Link>,
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: "Age",
            dataIndex: "age",
            key: "age",
            sorter: (a, b) => a.age - b.age
        },
        {
            title: "Shirt Number",
            dataIndex: "shirtNumber",
            key: "shirtNumber",
            sorter: (a, b) => (a.shirtNumber || 0) - (b.shirtNumber || 0)
        },
        {
            title: "Citizenship",
            dataIndex: "citizenships",
            key: "citizenships",
            render: (citizenships) => {
                if (!citizenships || !Array.isArray(citizenships)) return "-";
                return (
                    <span>
                        {citizenships.map(country => (
                            <Tag key={country} color="green" style={{marginBottom: "5px"}}>
                                <Link to={`/players?citizenship=${encodeURIComponent(country)}`}>
                                    {country}
                                </Link>
                            </Tag>
                        ))}
                    </span>
                );
            },
            sorter: (a, b) => {
                const aStr = Array.isArray(a.citizenships) ? a.citizenships.join(', ') : '';
                const bStr = Array.isArray(b.citizenships) ? b.citizenships.join(', ') : '';
                return aStr.localeCompare(bStr);
            }
        },
        {
            title: "Position",
            dataIndex: "positions",
            key: "positions",
            render: (positions) => {
                if (!positions || !Array.isArray(positions)) return "-";
                return (
                    <span>
                        {positions.map(pos => (
                            <Tag key={pos} color="blue" style={{marginBottom: "5px"}}>
                                <Link to={`/players?position=${encodeURIComponent(pos)}`}>
                                    {pos}
                                </Link>
                            </Tag>
                        ))}
                    </span>
                );
            },
            sorter: (a, b) => {
                const aStr = Array.isArray(a.positions) ? a.positions.join(', ') : '';
                const bStr = Array.isArray(b.positions) ? b.positions.join(', ') : '';
                return aStr.localeCompare(bStr);
            }
        },
        {
            title: "Club",
            dataIndex: "currentClub",
            key: "club",
            sorter: (a, b) => {
                const aClub = a.currentClub || '';
                const bClub = b.currentClub || '';
                return aClub.localeCompare(bClub);
            }
        },
        {
            title: "Market Value",
            dataIndex: "marketValue",
            key: "marketValue",
            render: (value) => `${value} m€`,
            sorter: (a, b) => (a.marketValue || 0) - (b.marketValue || 0)
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
                            <Button type="link" href="/players">Clear filters</Button>
                        }
                    />
                </Card>
            )}
            <Card title="Player Table">
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
        </>
    );
};

export default ClientPlayerTable;