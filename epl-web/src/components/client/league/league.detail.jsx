import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Col, Row, Typography, Spin, Select, Table, Tabs, Button, Modal, notification } from "antd";
import { BarChartOutlined, CalendarOutlined, TrophyOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { fetchLeagueDetailAPI, fetchLeagueSeasonDetailAPI, fetchMatchesBySeasonAPI } from "../../../services/api.service.js";

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const LeagueDetailPage = () => {
    const [league, setLeague] = useState(null);
    const [loading, setLoading] = useState(true);
    const [seasons, setSeasons] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [seasonData, setSeasonData] = useState(null);
    const [clubs, setClubs] = useState([]);
    const [matches, setMatches] = useState([]);
    const [topScorers, setTopScorers] = useState([]);
    const [standings, setStandings] = useState([]);
    const [seasonLoading, setSeasonLoading] = useState(false);
    const { id } = useParams();

    // Modal states
    const [matchdayModalVisible, setMatchdayModalVisible] = useState(false);
    const [standingsModalVisible, setStandingsModalVisible] = useState(false);
    const [scorersModalVisible, setScorersModalVisible] = useState(false);

    // Fetch league details when component mounts
    useEffect(() => {
        const fetchLeagueDetail = async () => {
            setLoading(true);
            try {
                const res = await fetchLeagueDetailAPI(id);

                if (res.data) {
                    setLeague(res.data);

                    // Extract seasons from league data
                    if (res.data.leagueSeasons && res.data.leagueSeasons.length > 0) {
                        const seasonsList = res.data.leagueSeasons.map(season => ({
                            id: season.id,
                            name: season.name
                        }));
                        setSeasons(seasonsList);

                        // Select the first season by default
                        if (seasonsList.length > 0) {
                            setSelectedSeason(seasonsList[0]);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch league details:", error);
                notification.error({
                    message: "Error",
                    description: "Failed to load league details"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchLeagueDetail();
    }, [id]);

    // Fetch season data when selected season changes
    useEffect(() => {
        const fetchSeasonData = async () => {
            if (!selectedSeason) return;

            setSeasonLoading(true);
            try {
                // Fetch the league season details
                const res = await fetchLeagueSeasonDetailAPI(selectedSeason.id);

                if (res.data) {
                    const seasonDetail = res.data;
                    setSeasonData(seasonDetail);

                    // Process clubs data
                    if (seasonDetail.clubSeasonTables && seasonDetail.clubSeasonTables.length > 0) {
                        // Format club data for display
                        const clubData = seasonDetail.clubSeasonTables.map(clubTable => ({
                            id: clubTable.club.id,
                            name: clubTable.club.name,
                            stadium: clubTable.club.stadiumName || 'Unknown Stadium',
                            manager: 'TBD' // This might need to be fetched from another API
                        }));
                        setClubs(clubData);

                        // Format standings data
                        const standingsData = [...seasonDetail.clubSeasonTables]
                            .sort((a, b) => b.points - a.points || b.diff - a.diff)
                            .map((clubTable, index) => ({
                                position: index + 1,
                                team: clubTable.club.name,
                                played: clubTable.numWins + clubTable.numDraws + clubTable.numLosses,
                                won: clubTable.numWins,
                                drawn: clubTable.numDraws,
                                lost: clubTable.numLosses,
                                goalsFor: clubTable.goalScores,
                                goalsAgainst: clubTable.goalConceded,
                                goalDifference: clubTable.diff,
                                points: clubTable.points
                            }));
                        setStandings(standingsData);
                    } else {
                        setClubs([]);
                        setStandings([]);
                    }

                    // Fetch matches data for the season using dedicated matches API
                    try {
                        const matchesRes = await fetchMatchesBySeasonAPI(selectedSeason.id);
                        if (matchesRes.data && (matchesRes.data.result || Array.isArray(matchesRes.data))) {
                            const matchesData = Array.isArray(matchesRes.data)
                                ? matchesRes.data
                                : matchesRes.data.result;

                            const formattedMatches = matchesData.map(match => ({
                                id: match.id,
                                round: match.round || 1,
                                homeTeam: match.host.name,
                                awayTeam: match.away.name,
                                score: `${match.hostScore ?? 0}-${match.awayScore ?? 0}`,
                                date: new Date(match.date).toLocaleDateString(),
                                rawDate: match.date
                            }));

                            // Sort matches by date (newest first) for initial display
                            const sortedMatches = [...formattedMatches].sort((a, b) =>
                                new Date(b.rawDate) - new Date(a.rawDate)
                            );

                            setMatches(sortedMatches);
                        } else {
                            setMatches([]);
                        }
                    } catch (matchError) {
                        console.error("Failed to fetch matches:", matchError);
                        setMatches([]);
                    }

                    // Process top scorers (if available)
                    // For now, we'll use an empty array as this data might not be available
                    setTopScorers([]);
                }
            } catch (error) {
                console.error("Failed to fetch season data:", error);
                notification.error({
                    message: "Error",
                    description: "Failed to load season data"
                });
            } finally {
                setSeasonLoading(false);
            }
        };

        fetchSeasonData();
    }, [selectedSeason]);

    // Handle season change
    const handleSeasonChange = (value) => {
        const selected = seasons.find(season => season.id === value);
        setSelectedSeason(selected);
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!league) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Title level={3}>League not found</Title>
            </div>
        );
    }

    // Define table columns with sorters
    const clubColumns = [
        {
            title: "Club",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: "Stadium",
            dataIndex: "stadium",
            key: "stadium",
            sorter: (a, b) => a.stadium.localeCompare(b.stadium)
        },
        {
            title: "Manager",
            dataIndex: "manager",
            key: "manager",
            sorter: (a, b) => a.manager.localeCompare(b.manager)
        },
    ];

    const matchColumns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            sorter: (a, b) => new Date(a.rawDate) - new Date(b.rawDate)
        },
        {
            title: "Home Team",
            dataIndex: "homeTeam",
            key: "homeTeam",
            sorter: (a, b) => a.homeTeam.localeCompare(b.homeTeam)
        },
        {
            title: "Score",
            dataIndex: "score",
            key: "score",
            sorter: (a, b) => {
                const [aHome, aAway] = a.score.split('-').map(n => parseInt(n.trim(), 10));
                const [bHome, bAway] = b.score.split('-').map(n => parseInt(n.trim(), 10));
                return (aHome - aAway) - (bHome - bAway);
            }
        },
        {
            title: "Away Team",
            dataIndex: "awayTeam",
            key: "awayTeam",
            sorter: (a, b) => a.awayTeam.localeCompare(b.awayTeam)
        },
    ];

    const scorerColumns = [
        {
            title: "Rank",
            key: "rank",
            render: (_, __, index) => index + 1,
            sorter: (a, b) => a.id - b.id
        },
        {
            title: "Player",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: "Team",
            dataIndex: "team",
            key: "team",
            sorter: (a, b) => a.team.localeCompare(b.team)
        },
        {
            title: "Goals",
            dataIndex: "goals",
            key: "goals",
            sorter: (a, b) => a.goals - b.goals,
            defaultSortOrder: 'descend'
        },
    ];

    const standingColumns = [
        {
            title: "Pos",
            dataIndex: "position",
            key: "position",
            width: 50,
            sorter: (a, b) => a.position - b.position,
            defaultSortOrder: 'ascend'
        },
        {
            title: "Team",
            dataIndex: "team",
            key: "team",
            sorter: (a, b) => a.team.localeCompare(b.team)
        },
        {
            title: "P",
            dataIndex: "played",
            key: "played",
            width: 50,
            sorter: (a, b) => a.played - b.played
        },
        {
            title: "Pts",
            dataIndex: "points",
            key: "points",
            width: 50,
            sorter: (a, b) => a.points - b.points,
            defaultSortOrder: 'descend'
        }
    ];

    // Extended columns for detailed views
    const detailedStandingColumns = [
        {
            title: "Pos",
            dataIndex: "position",
            key: "position",
            sorter: (a, b) => a.position - b.position,
            defaultSortOrder: 'ascend'
        },
        {
            title: "Team",
            dataIndex: "team",
            key: "team",
            sorter: (a, b) => a.team.localeCompare(b.team)
        },
        {
            title: "P",
            dataIndex: "played",
            key: "played",
            sorter: (a, b) => a.played - b.played
        },
        {
            title: "W",
            dataIndex: "won",
            key: "won",
            sorter: (a, b) => a.won - b.won
        },
        {
            title: "D",
            dataIndex: "drawn",
            key: "drawn",
            sorter: (a, b) => a.drawn - b.drawn
        },
        {
            title: "L",
            dataIndex: "lost",
            key: "lost",
            sorter: (a, b) => a.lost - b.lost
        },
        {
            title: "GF",
            dataIndex: "goalsFor",
            key: "goalsFor",
            sorter: (a, b) => a.goalsFor - b.goalsFor
        },
        {
            title: "GA",
            dataIndex: "goalsAgainst",
            key: "goalsAgainst",
            sorter: (a, b) => a.goalsAgainst - b.goalsAgainst
        },
        {
            title: "GD",
            dataIndex: "goalDifference",
            key: "goalDifference",
            sorter: (a, b) => a.goalDifference - b.goalDifference
        },
        {
            title: "Pts",
            dataIndex: "points",
            key: "points",
            sorter: (a, b) => a.points - b.points,
            defaultSortOrder: 'descend'
        }
    ];

    // Group matches by round for tabs
    const matchesByRound = matches.reduce((groups, match) => {
        const round = match.round || 1;
        if (!groups[round]) groups[round] = [];
        groups[round].push(match);
        return groups;
    }, {});

    // Create match tabs
    const matchTabs = Object.keys(matchesByRound).sort((a, b) => Number(a) - Number(b)).map(round => (
        <TabPane tab={`Matchday ${round}`} key={round}>
            <Table
                columns={matchColumns}
                dataSource={matchesByRound[round]}
                rowKey="id"
                pagination={false}
            />
        </TabPane>
    ));

    return (
        <div style={{ padding: "30px" }}>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Title level={2}>{league.name}</Title>
                            <Select
                                value={selectedSeason?.id}
                                style={{ width: 150 }}
                                onChange={handleSeasonChange}
                                disabled={seasons.length === 0}
                                loading={seasonLoading}
                            >
                                {seasons.map(season => (
                                    <Option key={season.id} value={season.id}>{season.name}</Option>
                                ))}
                            </Select>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                {/* Main content area - left and center */}
                <Col xs={24} md={17}>
                    <Card title="Clubs">
                        {seasonLoading ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <Spin />
                            </div>
                        ) : clubs.length > 0 ? (
                            <Table
                                columns={clubColumns}
                                dataSource={clubs}
                                rowKey="id"
                                pagination={false}
                            />
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                No clubs available for this season
                            </div>
                        )}
                    </Card>

                    <Card
                        title="Latest Matches"
                        style={{ marginTop: 16 }}
                        extra={matches.length > 0 && (
                            <Button
                                type="link"
                                onClick={() => setMatchdayModalVisible(true)}
                                icon={<ArrowRightOutlined />}
                            >
                                See All Matchdays
                            </Button>
                        )}
                    >
                        {seasonLoading ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <Spin />
                            </div>
                        ) : matches.length > 0 ? (
                            <Table
                                columns={matchColumns}
                                dataSource={matches.slice(0, 5)} // Show only the latest 5 matches
                                rowKey="id"
                                pagination={false}
                            />
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                No matches available for this season
                            </div>
                        )}
                    </Card>

                    <Card
                        title="Top Goal Scorers"
                        style={{ marginTop: 16 }}
                        extra={topScorers.length > 0 && (
                            <Button
                                type="link"
                                onClick={() => setScorersModalVisible(true)}
                                icon={<ArrowRightOutlined />}
                            >
                                See Full List
                            </Button>
                        )}
                    >
                        {seasonLoading ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <Spin />
                            </div>
                        ) : topScorers.length > 0 ? (
                            <Table
                                columns={scorerColumns}
                                dataSource={topScorers.slice(0, 5)} // Show only top 5 scorers
                                rowKey="id"
                                pagination={false}
                            />
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                No scorer statistics available
                            </div>
                        )}
                    </Card>
                </Col>

                {/* Right sidebar */}
                <Col xs={24} md={7}>
                    <Card
                        title="League Table"
                        extra={standings.length > 0 && (
                            <Button
                                type="link"
                                onClick={() => setStandingsModalVisible(true)}
                                icon={<ArrowRightOutlined />}
                            >
                                Full Table
                            </Button>
                        )}
                    >
                        {seasonLoading ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <Spin />
                            </div>
                        ) : standings.length > 0 ? (
                            <Table
                                columns={standingColumns}
                                dataSource={standings}
                                rowKey="position"
                                pagination={false}
                                size="small"
                            />
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                No standings available for this season
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Modals for detailed views */}
            <Modal
                title={`${league.name} - All Matches (${selectedSeason?.name})`}
                open={matchdayModalVisible}
                onCancel={() => setMatchdayModalVisible(false)}
                width={800}
                footer={null}
            >
                {matchTabs.length > 0 ? (
                    <Tabs defaultActiveKey="1">{matchTabs}</Tabs>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        No match data available
                    </div>
                )}
            </Modal>

            <Modal
                title={`${league.name} - Full Standings (${selectedSeason?.name})`}
                open={standingsModalVisible}
                onCancel={() => setStandingsModalVisible(false)}
                width={1000}
                footer={null}
            >
                <Table
                    columns={detailedStandingColumns}
                    dataSource={standings}
                    rowKey="position"
                    pagination={false}
                    scroll={{ x: 800 }}
                />
            </Modal>

            <Modal
                title={`${league.name} - Top Scorers (${selectedSeason?.name})`}
                open={scorersModalVisible}
                onCancel={() => setScorersModalVisible(false)}
                width={800}
                footer={null}
            >
                <Table
                    columns={scorerColumns}
                    dataSource={topScorers}
                    rowKey="id"
                    pagination={false}
                />
            </Modal>
        </div>
    );
};

export default LeagueDetailPage;