// epl-web/src/components/client/player/player.table.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Table, Card, Alert, Button, Tag } from "antd";
import { fetchAllPlayersAPI } from "../../../services/api.service.js";

const ClientPlayerTable = () => {
    const [searchParams] = useSearchParams();
    const [filterInfo, setFilterInfo] = useState(null);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // Extract filter parameters from URL
    const position = searchParams.get('position');
    const citizenship = searchParams.get('citizenship');
    const transferType = searchParams.get('transferType');
    const club = searchParams.get('club');

    // Determine if we have any filters active
    useEffect(() => {
        if (position || citizenship || transferType || club) {
            let filterText = "Filtering by: ";
            let filters = [];

            if (position) filters.push(`Position "${position}"`);
            if (citizenship) filters.push(`Nationality "${citizenship}"`);
            if (transferType) filters.push(`Transfer Type "${transferType}"`);
            if (club) filters.push(`Club ID "${club}"`);

            setFilterInfo(filterText + filters.join(", "));
        } else {
            setFilterInfo(null);
        }
    }, [position, citizenship, transferType, club]);

    const fetchPlayers = async (params = {}) => {
        setLoading(true);
        try {
            // Build filter query for Spring Filter
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

            // API query parameters
            const queryParams = {
                page: params.current || pagination.current,
                size: params.pageSize || pagination.pageSize,
                filter: filterParts.length > 0 ? filterParts.join(' and ') : undefined,
                sort: params.field && params.order ?
                    `${params.field},${params.order === 'ascend' ? 'asc' : 'desc'}` : undefined
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

    const handleTableChange = (newPagination, filters, sorter) => {
        fetchPlayers({
            current: newPagination.current,
            pageSize: newPagination.pageSize,
            field: sorter.field,
            order: sorter.order
        });
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text, record) => <Link to={`/players/${record.id}`}>{text}</Link>,
            sorter: true
        },
        {
            title: "Age",
            dataIndex: "age",
            key: "age",
            sorter: true
        },
        {
            title: "Shirt Number",
            dataIndex: "shirtNumber",
            key: "shirtNumber",
            sorter: true
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
            sorter: true
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
            sorter: true
        },
        {
            title: "Club",
            key: "club",
            render: (_, record) => {
                if (!record.transferHistories || !record.transferHistories.length)
                    return "No club";

                const currentClub = record.transferHistories[0].club;
                let clubName, clubId;

                if (typeof currentClub === 'object' && currentClub) {
                    clubName = currentClub.name;
                    clubId = currentClub.id;
                    return <Link to={`/players?club=${clubId}`}>{clubName}</Link>;
                } else {
                    return currentClub || "No club";
                }
            },
            sorter: true
        },
        {
            title: "Market Value",
            dataIndex: "marketValue",
            key: "marketValue",
            render: (value) => `${value} m€`,
            sorter: true
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