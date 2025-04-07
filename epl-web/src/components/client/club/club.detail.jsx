// epl-web/src/components/client/club/club.season.detail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, Tabs, Table, Tag, Select, Typography, Descriptions, Avatar, Row, Col, Divider } from "antd";
import { fetchClubDetailAPI } from "../../../services/api.service.js";
import { Link } from "react-router-dom";
import axios from "../../../services/axios.customize";

const { TabPane } = Tabs;
const { Option } = Select;
const { Title, Text } = Typography;

const ClientClubSeasonDetail = () => {
    const { id } = useParams();
    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [seasons, setSeasons] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [seasonId, setSeasonId] = useState(null);

    const [squadList, setSquadList] = useState([]);
    const [transfers, setTransfers] = useState([]);
    const [arrivals, setArrivals] = useState([]);
    const [departures, setDepartures] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    // Load club details on initial render
    useEffect(() => {
        const fetchClubDetail = async () => {
            setLoading(true);
            try {
                const response = await fetchClubDetailAPI(id);
                if (response.data) {
                    setClub(response.data);

                    // Get seasons from the club's competition history
                    if (response.data.seasons && response.data.seasons.length > 0) {
                        const seasonsList = response.data.seasons.map(season => ({
                            id: season.id,
                            name: `${season.name} (${season.league.name})`,
                            leagueId: season.league.id
                        }));

                        setSeasons(seasonsList);

                        // Set the first season as default
                        if (seasonsList.length > 0) {
                            setSelectedSeason(seasonsList[0]);
                            setSeasonId(seasonsList[0].id);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching club details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClubDetail();
    }, [id]);

    // Load season-specific data when season changes
    useEffect(() => {
        if (!seasonId) return;

        const fetchSeasonData = async () => {
            setDataLoading(true);

            try {
                // Fetch squad list for the selected season
                const squadResponse = await axios.get(`/api/v1/clubs/${id}/squad?seasonId=${seasonId}`);
                if (squadResponse.data && squadResponse.data.data) {
                    setSquadList(squadResponse.data.data);
                }

                // Fetch transfers for the selected season
                const transferResponse = await axios.get(`/api/v1/clubs/${id}/transfers?seasonId=${seasonId}`);
                if (transferResponse.data && transferResponse.data.data) {
                    const transferData = transferResponse.data.data;
                    setTransfers(transferData);

                    // Separate transfers into arrivals and departures
                    const arrivals = transferData.filter(transfer =>
                        transfer.club === club.name && transfer.previousClub !== club.name
                    );

                    const departures = transferData.filter(transfer =>
                        transfer.previousClub === club.name && transfer.club !== club.name
                    );

                    setArrivals(arrivals);
                    setDepartures(departures);
                }
            } catch (error) {
                console.error("Error fetching season data:", error);
            } finally {
                setDataLoading(false);
            }
        };

        fetchSeasonData();
    }, [seasonId, id, club]);

    const handleSeasonChange = (value) => {
        const selected = seasons.find(season => season.id === value);
        setSelectedSeason(selected);
        setSeasonId(value);
    };

    // Define columns for the squad table
    const squadColumns = [
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
            width: 80,
            sorter: (a, b) => a.age - b.age
        },
        {
            title: "#",
            dataIndex: "shirtNumber",
            key: "shirtNumber",
            width: 70,
            sorter: (a, b) => (a.shirtNumber || 0) - (b.shirtNumber || 0)
        },
        {
            title: "Position",
            dataIndex: "positions",
            key: "positions",
            render: (positions) => {
                if (!positions) return "-";
                const posArray = Array.isArray(positions) ? positions : [positions];
                return (
                    <span>
                        {posArray.map(pos => (
                            <Tag key={pos} color="blue" style={{marginRight: "5px"}}>
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
            title: "Nationality",
            dataIndex: "citizenships",
            key: "citizenships",
            render: (citizenships) => {
                if (!citizenships) return "-";
                const nationArray = Array.isArray(citizenships) ? citizenships : [citizenships];
                return (
                    <span>
                        {nationArray.map(country => (
                            <Tag key={country} color="green" style={{marginRight: "5px"}}>
                                <Link to={`/players?citizenship=${encodeURIComponent(country)}`}>
                                    {country}
                                </Link>
                            </Tag>
                        ))}
                    </span>
                );
            }
        },
        {
            title: "Market Value",
            dataIndex: "marketValue",
            key: "marketValue",
            render: (value) => `${value} m€`,
            sorter: (a, b) => a.marketValue - b.marketValue
        }
    ];

    // Define columns for the transfers table
    const transferColumns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (date) => new Date(date).toLocaleDateString(),
            sorter: (a, b) => new Date(a.date) - new Date(b.date)
        },
        {
            title: "Player",
            dataIndex: "player",
            key: "player",
            render: (text) => <span>{text}</span>,
            sorter: (a, b) => a.player.localeCompare(b.player)
        },
        {
            title: "From",
            dataIndex: "previousClub",
            key: "from",
            render: (text) => text || "-"
        },
        {
            title: "To",
            dataIndex: "club",
            key: "to"
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (text) => {
                let color = 'blue';
                if (text === 'Free Transfer') color = 'purple';
                if (text === 'Loan') color = 'orange';
                if (text === 'End of loan') color = 'cyan';
                return <Tag color={color}>{text}</Tag>;
            },
            filters: [
                { text: 'Permanent', value: 'Permanent' },
                { text: 'Free Transfer', value: 'Free Transfer' },
                { text: 'Loan', value: 'Loan' },
                { text: 'End of loan', value: 'End of loan' }
            ],
            onFilter: (value, record) => record.type === value
        },
        {
            title: "Fee",
            dataIndex: "fee",
            key: "fee",
            render: (fee) => `${fee} m€`,
            sorter: (a, b) => a.fee - b.fee
        }
    ];

    // Show loading spinner while fetching initial data
    if (loading || !club) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: "30px" }}>
            <Card>
                <Row gutter={16} align="middle">
                    {/* Club Logo/Image */}
                    <Col span={4}>
                        {club.logo ? (
                            <Avatar src={club.logo} size={100} />
                        ) : (
                            <Avatar size={100}>{club.name.charAt(0)}</Avatar>
                        )}
                    </Col>

                    {/* Club Basic Info */}
                    <Col span={16}>
                        <Title level={2}>{club.name}</Title>
                        <Descriptions column={2}>
                            <Descriptions.Item label="Country">{club.country}</Descriptions.Item>
                            <Descriptions.Item label="Stadium">{club.stadiumName || 'N/A'}</Descriptions.Item>
                        </Descriptions>
                    </Col>

                    {/* Season Selector */}
                    <Col span={4}>
                        <Text strong>Season</Text>
                        <Select
                            style={{ width: '100%', marginTop: '8px' }}
                            value={selectedSeason?.id}
                            onChange={handleSeasonChange}
                            disabled={seasons.length === 0}
                        >
                            {seasons.map(season => (
                                <Option key={season.id} value={season.id}>{season.name}</Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
            </Card>

            <Divider />

            {/* Render season-specific data */}
            {selectedSeason ? (
                <Tabs defaultActiveKey="squad">
                    <TabPane tab="Squad" key="squad">
                        <Card title={`${club.name} Squad - ${selectedSeason.name}`}>
                            {dataLoading ? (
                                <div style={{ textAlign: "center", padding: "20px" }}>
                                    <Spin />
                                </div>
                            ) : squadList.length > 0 ? (
                                <Table
                                    dataSource={squadList}
                                    columns={squadColumns}
                                    rowKey="id"
                                    pagination={false}
                                />
                            ) : (
                                <div style={{ textAlign: "center", padding: "20px" }}>
                                    No player information available for this season
                                </div>
                            )}
                        </Card>
                    </TabPane>

                    <TabPane tab="Transfers" key="transfers">
                        <Row gutter={[16, 16]}>
                            {/* Arrivals */}
                            <Col span={24}>
                                <Card
                                    title={
                                        <div>
                                            <span style={{ color: 'green' }}>Arrivals</span>
                                            <span style={{ fontSize: '14px', color: 'grey', marginLeft: '10px' }}>
                                                ({arrivals.length} transfers)
                                            </span>
                                        </div>
                                    }
                                    bordered
                                >
                                    {dataLoading ? (
                                        <div style={{ textAlign: "center", padding: "20px" }}>
                                            <Spin />
                                        </div>
                                    ) : arrivals.length > 0 ? (
                                        <Table
                                            dataSource={arrivals}
                                            columns={transferColumns.filter(col => col.key !== 'to')}
                                            rowKey="id"
                                            pagination={false}
                                        />
                                    ) : (
                                        <div style={{ textAlign: "center", padding: "20px" }}>
                                            No arrivals in this season
                                        </div>
                                    )}
                                </Card>
                            </Col>

                            {/* Departures */}
                            <Col span={24}>
                                <Card
                                    title={
                                        <div>
                                            <span style={{ color: 'red' }}>Departures</span>
                                            <span style={{ fontSize: '14px', color: 'grey', marginLeft: '10px' }}>
                                                ({departures.length} transfers)
                                            </span>
                                        </div>
                                    }
                                    bordered
                                >
                                    {dataLoading ? (
                                        <div style={{ textAlign: "center", padding: "20px" }}>
                                            <Spin />
                                        </div>
                                    ) : departures.length > 0 ? (
                                        <Table
                                            dataSource={departures}
                                            columns={transferColumns.filter(col => col.key !== 'from')}
                                            rowKey="id"
                                            pagination={false}
                                        />
                                    ) : (
                                        <div style={{ textAlign: "center", padding: "20px" }}>
                                            No departures in this season
                                        </div>
                                    )}
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            ) : (
                <div style={{ textAlign: "center", padding: "50px" }}>
                    No season data available for this club
                </div>
            )}
        </div>
    );
};

export default ClientClubSeasonDetail;