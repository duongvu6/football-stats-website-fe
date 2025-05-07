import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {Table, Card, Alert, Button, Tag, Image} from "antd";
import { fetchAllCoachesAPI } from "../../../services/api.service.js";

const ClientCoachTable = () => {
    const [searchParams] = useSearchParams();
    const [filterInfo, setFilterInfo] = useState(null);
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const citizenship = searchParams.get('citizenship');
    const club = searchParams.get('club');

    useEffect(() => {
        if (citizenship || club) {
            let filterText = "Filtering by: ";
            let filters = [];

            if (citizenship) filters.push(`Nationality "${citizenship}"`);
            if (club) filters.push(`Club "${club}"`);

            setFilterInfo(filterText + filters.join(", "));
        } else {
            setFilterInfo(null);
        }
    }, [citizenship, club]);

    const fetchCoaches = async (params = {}) => {
        setLoading(true);
        try {

            let filterParts = [];

            if (citizenship) {
                filterParts.push(`citizenships : '${citizenship}'`);
            }

            if (club) {
                filterParts.push(`coachClubs.club.id : ${club}`);
            }

            const queryParams = {
                page: params.current || pagination.current,
                size: params.pageSize || pagination.pageSize,
                filter: filterParts.length > 0 ? filterParts.join(' and ') : undefined
            };

            const response = await fetchAllCoachesAPI(queryParams);

            if (response.data && response.data.result) {
                setCoaches(response.data.result);
                setPagination({
                    current: response.data.meta.page,
                    pageSize: response.data.meta.pageSize,
                    total: response.data.meta.total
                });
            }
        } catch (error) {
            console.error("Failed to fetch coaches:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoaches();
    }, [citizenship, club]);

    const handleTableChange = (newPagination, filters, sorter) => {

        if (newPagination.current !== pagination.current ||
            newPagination.pageSize !== pagination.pageSize) {
            fetchCoaches({
                current: newPagination.current,
                pageSize: newPagination.pageSize
            });
        }
    };

    const columns = [
        {
            title: "Image",
            dataIndex: "imageUrl",
            width: 80,
            render: (imageUrl) => (
                <Image
                    src={imageUrl}
                    alt="Head coach"
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
            render: (text, record) => <Link to={`/coaches/${record.id}`}>{text}</Link>,
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: "Age",
            dataIndex: "age",
            key: "age",
            sorter: (a, b) => a.age - b.age
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
                                <Link to={`/coaches?citizenship=${encodeURIComponent(country)}`}>
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
            title: "Club",
            key: "club",
            render: (_, record) => {
                if (!record.coachClubs || !record.coachClubs.length)
                    return "No club";

                const currentClub = record.coachClubs[0].club;
                let clubName, clubId;

                if (typeof currentClub === 'object' && currentClub) {
                    clubName = currentClub.name;
                    clubId = currentClub.id;
                    return <Link to={`/coaches?club=${clubId}`}>{clubName}</Link>;
                } else {
                    return currentClub || "No club";
                }
            },
            sorter: (a, b) => {
                const aClub = a.coachClubs && a.coachClubs[0] && a.coachClubs[0].club ?
                    (typeof a.coachClubs[0].club === 'object' ? a.coachClubs[0].club.name : a.coachClubs[0].club) : '';

                const bClub = b.coachClubs && b.coachClubs[0] && b.coachClubs[0].club ?
                    (typeof b.coachClubs[0].club === 'object' ? b.coachClubs[0].club.name : b.coachClubs[0].club) : '';

                return aClub.toString().localeCompare(bClub.toString());
            }
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
                            <Button type="link" href="/coaches">Clear filters</Button>
                        }
                    />
                </Card>
            )}
            <Card title="Head Coach Table">
                <Table
                    columns={columns}
                    dataSource={coaches}
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

export default ClientCoachTable;