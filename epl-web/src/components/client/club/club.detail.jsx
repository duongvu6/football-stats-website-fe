
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Card, Spin, Tabs, Table, Tag, Select, Typography, Descriptions,
    Avatar, Row, Col, Divider, notification, Empty, Image
} from "antd";
import { Link } from "react-router-dom";
import {
    fetchClubDetailAPI,
    getClubSeasonsAPI,
    getClubSquadAPI,
    getClubTransfersAPI,
    getClubTopScorersAPI,
    getClubTopAssistsAPI,
    fetchLeagueSeasonDetailAPI
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
    const [topScorers, setTopScorers] = useState([]);
    const [topAssists, setTopAssists] = useState([]);
    const [leagueTableData, setLeagueTableData] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    const [statsLoading, setStatsLoading] = useState(false);
    const [leagueTableLoading, setLeagueTableLoading] = useState(false);

    useEffect(() => {
        const fetchClubData = async () => {
            setLoading(true);
            try {

                const clubResponse = await fetchClubDetailAPI(id);
                if (clubResponse.data) {
                    setClub(clubResponse.data);
                }

                const seasonResponse = await getClubSeasonsAPI(id);
                if (seasonResponse.data) {
                    const seasonsList = seasonResponse.data.map(season => ({
                        id: season.id,
                        name: season.name,
                        leagueId: season.league?.id,
                        leagueName: season.league?.name
                    }));

                    setSeasons(seasonsList);

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

    useEffect(() => {
        if (!selectedSeason) return;

        const fetchSeasonData = async () => {
            setDataLoading(true);
            setStatsLoading(true);
            try {

                const squadResponse = await getClubSquadAPI(id, selectedSeason.id);
                if (squadResponse.data) {
                    setSquadList(squadResponse.data);
                } else {
                    setSquadList([]);
                }

                const transferResponse = await getClubTransfersAPI(id, selectedSeason.id);
                if (transferResponse.data) {
                    setTransfers(transferResponse.data);


                    if (club && club.name) {
                        const clubName = club.name;

                        const arrivalsData = transferResponse.data.filter(transfer =>
                            transfer.club === clubName ||
                            (transfer.club && transfer.club.id === parseInt(id))
                        );
                        setArrivals(arrivalsData);

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

                try {
                    const scorersResponse = await getClubTopScorersAPI(selectedSeason.id, id);
                    if (scorersResponse.data) {
                        setTopScorers(scorersResponse.data);
                    } else {
                        setTopScorers([]);
                    }
                } catch (error) {
                    console.error("Error loading top scorers:", error);
                    setTopScorers([]);
                }

                try {
                    const assistsResponse = await getClubTopAssistsAPI(selectedSeason.id, id);
                    if (assistsResponse.data) {
                        setTopAssists(assistsResponse.data);
                    } else {
                        setTopAssists([]);
                    }
                } catch (error) {
                    console.error("Error loading top assists:", error);
                    setTopAssists([]);
                }

                setLeagueTableLoading(true);
                try {
                    const leagueSeasonResponse = await fetchLeagueSeasonDetailAPI(selectedSeason.id);
                    if (leagueSeasonResponse.data && leagueSeasonResponse.data.clubSeasonTables) {

                        const sortedData = [...leagueSeasonResponse.data.clubSeasonTables]
                            .sort((a, b) => {

                                if (a.ranked && b.ranked) return a.ranked - b.ranked;
                                return b.points - a.points || b.diff - a.diff;
                            })
                            .map((item, index) => ({
                                ...item,
                                position: item.ranked || index + 1,
                                played: item.numWins + item.numDraws + item.numLosses,
                                isCurrentClub: item.club.id === parseInt(id)
                            }));
                        setLeagueTableData(sortedData);
                    } else {
                        setLeagueTableData([]);
                    }
                } catch (error) {
                    console.error("Error fetching league standings:", error);
                    setLeagueTableData([]);
                } finally {
                    setLeagueTableLoading(false);
                }

            } catch (error) {
                console.error("Error fetching season data:", error);
                notification.error({
                    message: "Error",
                    description: "Failed to load season data"
                });
            } finally {
                setDataLoading(false);
                setStatsLoading(false);
            }
        };

        fetchSeasonData();
    }, [selectedSeason, id, club]);

    const handleSeasonChange = (value) => {
        const selected = seasons.find(season => season.id === value);
        setSelectedSeason(selected);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

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

    const statsColumns = [
        {
            title: "Rank",
            key: "rank",
            width: 70,
            render: (_, __, index) => index + 1
        },
        {
            title: "Player",
            dataIndex: "playerName",
            key: "player",
            render: (text, record) => (
                <Link to={`/players/${record.playerId}`}>{text}</Link>
            )
        },
        {
            title: "Goals",
            dataIndex: "goals",
            key: "goals",
            width: 90,
            sorter: (a, b) => a.goals - b.goals,
            defaultSortOrder: 'descend'
        }
    ];

    const assistsColumns = [
        {
            title: "Rank",
            key: "rank",
            width: 70,
            render: (_, __, index) => index + 1
        },
        {
            title: "Player",
            dataIndex: "playerName",
            key: "player",
            render: (text, record) => (
                <Link to={`/players/${record.playerId}`}>{text}</Link>
            )
        },
        {
            title: "Assists",
            dataIndex: "assists",
            key: "assists",
            width: 90,
            sorter: (a, b) => a.assists - b.assists,
            defaultSortOrder: 'descend'
        }
    ];

    const leagueTableColumns = [
        {
            title: "Position",
            dataIndex: "position",
            key: "position",
            width: 70,
            sorter: (a, b) => a.position - b.position
        },
        {
            title: "Club",
            dataIndex: "club",
            key: "club",
            render: (club) => club.name,
            sorter: (a, b) => a.club.name.localeCompare(b.club.name)
        },
        {
            title: "Played",
            dataIndex: "played",
            key: "played",
            width: 90,
            sorter: (a, b) => a.played - b.played
        },
        {
            title: "Wins",
            dataIndex: "numWins",
            key: "wins",
            width: 90,
            sorter: (a, b) => a.numWins - b.numWins
        },
        {
            title: "Draws",
            dataIndex: "numDraws",
            key: "draws",
            width: 90,
            sorter: (a, b) => a.numDraws - b.numDraws
        },
        {
            title: "Losses",
            dataIndex: "numLosses",
            key: "losses",
            width: 90,
            sorter: (a, b) => a.numLosses - b.numLosses
        },
        {
            title: "Points",
            dataIndex: "points",
            key: "points",
            width: 90,
            sorter: (a, b) => a.points - b.points
        },
        {
            title: "Goal Difference",
            dataIndex: "diff",
            key: "diff",
            width: 90,
            sorter: (a, b) => a.diff - b.diff
        }
    ];

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
                    {/* Club Logo */}
                    <Col span={4} style={{ textAlign: "center" }}>
                        <Image
                            src={club.imageUrl}
                            alt={club.name}
                            style={{ maxWidth: 150, maxHeight: 150 }}
                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCY"
                        />
                    </Col>

                    {/* Club Basic Info */}
                    <Col span={16}>
                        <Title level={2}>{club.name}</Title>
                        <Descriptions column={2}>
                            <Descriptions.Item label="Country">{club.country}</Descriptions.Item>
                            <Descriptions.Item label="Stadium">{club.stadiumName || 'N/A'}</Descriptions.Item>
                        </Descriptions>
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

                    <TabPane tab="Statistics" key="statistics">
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Card title="Top Scorers">
                                    {statsLoading ? (
                                        <div style={{ textAlign: "center", padding: "20px" }}>
                                            <Spin />
                                        </div>
                                    ) : topScorers.length > 0 ? (
                                        <Table
                                            dataSource={topScorers}
                                            columns={statsColumns}
                                            rowKey="playerId"
                                            pagination={false}
                                            size="small"
                                        />
                                    ) : (
                                        <div style={{ textAlign: "center", padding: "20px" }}>
                                            No goal scorer data available for this season
                                        </div>
                                    )}
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title="Top Assists">
                                    {statsLoading ? (
                                        <div style={{ textAlign: "center", padding: "20px" }}>
                                            <Spin />
                                        </div>
                                    ) : topAssists.length > 0 ? (
                                        <Table
                                            dataSource={topAssists}
                                            columns={assistsColumns}
                                            rowKey="playerId"
                                            pagination={false}
                                            size="small"
                                        />
                                    ) : (
                                        <div style={{ textAlign: "center", padding: "20px" }}>
                                            No assist data available for this season
                                        </div>
                                    )}
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>

                    <TabPane tab="League Table" key="leagueTable">
                        <Card title="League Table">
                            {leagueTableLoading ? (
                                <div style={{ textAlign: "center", padding: "20px" }}>
                                    <Spin />
                                </div>
                            ) : leagueTableData.length > 0 ? (
                                <Table
                                    dataSource={leagueTableData}
                                    columns={leagueTableColumns}
                                    rowKey="club.id"
                                    pagination={false}
                                    size="small"
                                    rowClassName={(record) => record.isCurrentClub ? 'highlight-row' : ''}
                                    onRow={(record) => ({
                                        style: record.isCurrentClub ? { backgroundColor: '#f0f7ff', fontWeight: 'bold' } : {}
                                    })}
                                />
                            ) : (
                                <div style={{ textAlign: "center", padding: "20px" }}>
                                    No league table data available for this season
                                </div>
                            )}
                        </Card>
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