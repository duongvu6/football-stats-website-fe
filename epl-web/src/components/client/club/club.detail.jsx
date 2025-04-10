// epl-web/src/components/client/club/club.detail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Card, Spin, Tabs, Table, Tag, Select, Typography, Descriptions,
    Avatar, Row, Col, Divider, notification, Empty
} from "antd";
import { Link } from "react-router-dom";
import {
    fetchClubDetailAPI,
    getClubSeasonsAPI,
    getClubSquadAPI,
    getClubTransfersAPI
} from "../../../services/api.service.js";

const { TabPane } = Tabs;
const { Option } = Select;
const { Title, Text } = Typography;

const ClientClubDetail = () => {
    const { id } = useParams();
    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [seasons, setSeasons] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(null);

    const [squadList, setSquadList] = useState([]);
    const [transfers, setTransfers] = useState([]);
    const [arrivals, setArrivals] = useState([]);
    const [departures, setDepartures] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);

    // Load club details and available seasons
    useEffect(() => {
        const fetchClubData = async () => {
            setLoading(true);
            try {
                // Get club details
                const clubResponse = await fetchClubDetailAPI(id);
                if (clubResponse.data) {
                    setClub(clubResponse.data);
                }

                // Get seasons for this club
                const seasonResponse = await getClubSeasonsAPI(id);
                if (seasonResponse.data) {
                    const seasonsList = seasonResponse.data.map(season => ({
                        id: season.id,
                        name: season.name,
                        leagueId: season.league?.id,
                        leagueName: season.league?.name
                    }));

                    setSeasons(seasonsList);

                    // Set the first season as default if available
                    if (seasonsList.length > 0) {
                        setSelectedSeason(seasonsList[0]);
                    }
                }
            } catch (error) {
                console.error("Error fetching club data:", error);
                notification.error({
                    message: "Error",
                    description: "Failed to load club information"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchClubData();
    }, [id]);

    // Load season-specific data when selected season changes
    useEffect(() => {
        if (!selectedSeason) return;

        const fetchSeasonData = async () => {
            setDataLoading(true);
            try {
                // Fetch squad list for the selected season
                const squadResponse = await getClubSquadAPI(id, selectedSeason.id);
                if (squadResponse.data) {
                    setSquadList(squadResponse.data);
                } else {
                    setSquadList([]);
                }

                // Fetch transfers for the selected season
                const transferResponse = await getClubTransfersAPI(id, selectedSeason.id);
                if (transferResponse.data) {
                    setTransfers(transferResponse.data);

                    // Process and separate transfers into arrivals and departures
                    // Check if club name is available
                    if (club && club.name) {
                        const clubName = club.name;

                        // Arrivals: transfers TO this club (destination is this club)
                        const arrivalsData = transferResponse.data.filter(transfer =>
                            transfer.club === clubName ||
                            (transfer.club && transfer.club.id === parseInt(id))
                        );
                        setArrivals(arrivalsData);

                        // Departures: transfers FROM this club (source is this club)
                        const departuresData = transferResponse.data.filter(transfer =>
                            transfer.previousClub === clubName ||
                            (transfer.previousClub && transfer.previousClub.id === parseInt(id))
                        );
                        setDepartures(departuresData);
                    } else {
                        setArrivals([]);
                        setDepartures([]);
                    }
                } else {
                    setTransfers([]);
                    setArrivals([]);
                    setDepartures([]);
                }
            } catch (error) {
                console.error("Error fetching season data:", error);
                notification.error({
                    message: "Error",
                    description: "Failed to load season data"
                });
            } finally {
                setDataLoading(false);
            }
        };

        fetchSeasonData();
    }, [selectedSeason, id, club]);

    // Handle season selection change
    const handleSeasonChange = (value) => {
        const selected = seasons.find(season => season.id === value);
        setSelectedSeason(selected);
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Define columns for the squad table
    const squadColumns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <Link to={`/players/${record.id}`}>{text}</Link>
            ),
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: "Position",
            dataIndex: "positions",
            key: "positions",
            render: positions => (
                <span>
                    {positions && positions.map(position => (
                        <Tag color="blue" key={position}>
                            <Link to={`/players?position=${encodeURIComponent(position)}`}>
                                {position}
                            </Link>
                        </Tag>
                    ))}
                </span>
            ),
            sorter: (a, b) => {
                const aPos = a.positions && a.positions.length > 0 ? a.positions[0] : '';
                const bPos = b.positions && b.positions.length > 0 ? b.positions[0] : '';
                return aPos.localeCompare(bPos);
            }
        },
        {
            title: "Nationality",
            dataIndex: "citizenships",
            key: "citizenships",
            render: citizenships => (
                <span>
                    {citizenships && citizenships.map(country => (
                        <Tag color="green" key={country}>
                            <Link to={`/players?citizenship=${encodeURIComponent(country)}`}>
                                {country}
                            </Link>
                        </Tag>
                    ))}
                </span>
            ),
            sorter: (a, b) => {
                const aStr = Array.isArray(a.citizenships) ? a.citizenships.join(', ') : '';
                const bStr = Array.isArray(b.citizenships) ? b.citizenships.join(', ') : '';
                return aStr.localeCompare(bStr);
            }
        },
        {
            title: "Age",
            dataIndex: "age",
            key: "age",
            sorter: (a, b) => a.age - b.age
        },
        {
            title: "Market Value",
            dataIndex: "marketValue",
            key: "marketValue",
            render: (value) => value ? `${value} m€` : "-",
            sorter: (a, b) => a.marketValue - b.marketValue
        }
    ];

    // Define columns for the transfers table
    const transferColumns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (date) => formatDate(date),
            sorter: (a, b) => new Date(a.date) - new Date(b.date)
        },
        {
            title: "Player",
            dataIndex: "player",
            key: "player",
            render: (player, record) => (
                <Link to={`/players/${record.playerId}`}>{player}</Link>
            ),
            sorter: (a, b) => a.player.localeCompare(b.player)
        },
        {
            title: "From",
            dataIndex: "previousClub",
            key: "from",
            render: (prevClub) => prevClub || "Free Agent",
            sorter: (a, b) => (a.previousClub || "").localeCompare(b.previousClub || "")
        },
        {
            title: "To",
            dataIndex: "club",
            key: "to",
            render: (toClub) => toClub || "Free Agent",
            sorter: (a, b) => (a.club || "").localeCompare(b.club || "")
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) => {
                let color = 'blue';
                if (type === 'Signed') color = 'green';
                if (type === 'Released') color = 'red';
                if (type === 'Loan') color = 'orange';

                return (
                    <Tag color={color}>
                        {type}
                    </Tag>
                );
            },
            sorter: (a, b) => a.type.localeCompare(b.type)
        },
        {
            title: "Fee",
            dataIndex: "fee",
            key: "fee",
            render: (fee) => fee ? `${fee} m€` : "Free",
            sorter: (a, b) => (a.fee || 0) - (b.fee || 0)
        }
    ];

    // Show loading spinner while data is being fetched
    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!club) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Empty description="Club not found" />
            </div>
        );
    }

    return (
        <div style={{ padding: "30px" }}>
            {/* Club Header */}
            <Card>
                <Row gutter={16} align="middle">
                    {/* Club Logo/Avatar */}
                    <Col span={4} style={{ textAlign: "center" }}>
                        {club.logo ? (
                            <img src={club.logo} alt={club.name} style={{ maxWidth: 100, maxHeight: 100 }} />
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
                                <Option key={season.id} value={season.id}>
                                    {season.name} {season.leagueName ? `(${season.leagueName})` : ''}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
            </Card>

            <Divider />

            {/* Season-specific data */}
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

export default ClientClubDetail;