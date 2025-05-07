import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {Card, Col, Row, Typography, Spin, Select, Table, Tabs, Button, Modal, notification, Image} from "antd";
import { BarChartOutlined, CalendarOutlined, TrophyOutlined, ArrowRightOutlined } from "@ant-design/icons";
import {
    fetchLeagueDetailAPI,
    fetchLeagueSeasonDetailAPI,
    fetchMatchesBySeasonAPI, getTopAssistsAPI,
    getTopGoalScorerAPI, getTopRedCardsAPI, getTopYellowCardsAPI
} from "../../../services/api.service.js";

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
    const [topAssists, setTopAssists] = useState([]);
    const [topYellowCards, setTopYellowCards] = useState([]);
    const [topRedCards, setTopRedCards] = useState([]);
    const [standings, setStandings] = useState([]);
    const [seasonLoading, setSeasonLoading] = useState(false);
    const { id } = useParams();

    const [matchdayModalVisible, setMatchdayModalVisible] = useState(false);
    const [standingsModalVisible, setStandingsModalVisible] = useState(false);
    const [scorersModalVisible, setScorersModalVisible] = useState(false);
    const [assistsModalVisible, setAssistsModalVisible] = useState(false);
    const [yellowCardsModalVisible, setYellowCardsModalVisible] = useState(false);
    const [redCardsModalVisible, setRedCardsModalVisible] = useState(false);

    
    useEffect(() => {
        const fetchLeagueDetail = async () => {
            setLoading(true);
            try {
                const res = await fetchLeagueDetailAPI(id);

                if (res.data) {
                    setLeague(res.data);

                    
                    if (res.data.leagueSeasons && res.data.leagueSeasons.length > 0) {
                        const seasonsList = res.data.leagueSeasons.map(season => ({
                            id: season.id,
                            name: season.name
                        }));
                        setSeasons(seasonsList);

                        
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

    
    useEffect(() => {
        const fetchSeasonData = async () => {
            if (!selectedSeason) return;

            setSeasonLoading(true);
            try {
                
                const res = await fetchLeagueSeasonDetailAPI(selectedSeason.id);

                if (res.data) {
                    const seasonDetail = res.data;
                    setSeasonData(seasonDetail);
                    if (seasonDetail.clubSeasonTables && seasonDetail.clubSeasonTables.length > 0) {
                        
                        const clubData = seasonDetail.clubSeasonTables.map(clubTable => ({
                            id: clubTable.club.id,
                            name: clubTable.club.name,
                            stadium: clubTable.club.stadiumName || 'Unknown Stadium',
                            manager: clubTable.club.currentCoach == null ? "No Manager" : clubTable.club.currentCoach.name
                        }));
                        setClubs(clubData);

                        
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
                    try {
                        const res = await getTopGoalScorerAPI(selectedSeason.id);
                        if (res.data) {
                            setTopScorers(res.data);
                        }
                    } catch (topScorerError) {
                        notification.error({
                            message: "Failed to get top goal scorers",
                            description: topScorerError.message
                        });
                        setTopScorers([]);
                    }
                    try {
                        const res = await getTopAssistsAPI(selectedSeason.id);
                        if (res.data) {
                            setTopAssists(res.data);
                        }
                    } catch (error) {
                        notification.error({
                            message: "Failed to get top goal assists",
                            description: error.message
                        });
                        setTopAssists([]);
                    }
                    try {
                        const res = await getTopYellowCardsAPI(selectedSeason.id);
                        if (res.data) {
                            setTopYellowCards(res.data);
                        }
                    } catch (error) {
                        notification.error({
                            message: "Failed to get top yellow cards",
                            description: error.message
                        });
                        setTopYellowCards([]);
                    }
                    try {
                        const res = await getTopRedCardsAPI(selectedSeason.id);
                        if (res.data) {
                            setTopRedCards(res.data);
                        }
                    } catch (error) {
                        notification.error({
                            message: "Failed to get top red cards",
                            description: error.message
                        });
                        setTopRedCards([]);
                    }
                    
                    

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
            dataIndex: "playerName",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: "Club",
            dataIndex: "currentClub",
            key: "currentClub",
            sorter: (a, b) => a.team.localeCompare(b.team)
        },
        {
            title: "Goals",
            dataIndex: "goals",
            key: "goals",
            sorter: (a, b) => a.goals - b.goals,
            defaultSortOrder: 'descend'
        },
        {
            title: "Assists",
            dataIndex: "assists",
            key: "assists",
            sorter: (a, b) => a.assists - b.assists,
            defaultSortOrder: 'descend'
        }
    ];


    const cardColumns = [
        {
            title: "Rank",
            key: "rank",
            render: (_, __, index) => index + 1,
            sorter: (a, b) => a.id - b.id
        },
        {
            title: "Player",
            dataIndex: "playerName",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: "Club",
            dataIndex: "currentClub",
            key: "currentClub",
            sorter: (a, b) => a.team.localeCompare(b.team)
        },
        {
            title: "Yellow Cards",
            dataIndex: "yellowCards",
            key: "yellowCards",


        },
        {
            title: "Red Cards",
            dataIndex: "redCards",
            key: "redCards",
        }
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

    
    const matchesByRound = matches.reduce((groups, match) => {
        const round = match.round || 1;
        if (!groups[round]) groups[round] = [];
        groups[round].push(match);
        return groups;
    }, {});

    
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
                        <Row gutter={[24, 24]}>
                            <Col xs={24} sm={8} md={6} style={{ textAlign: 'center' }}>
                                <Image
                                    src={league.imageUrl}
                                    alt={league.name}
                                    style={{ maxWidth: '150px', maxHeight: '150px' }}
                                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCY"
                                />
                            </Col>
                            <Col xs={24} sm={16} md={18}>
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
                            </Col>
                        </Row>
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
                                dataSource={matches.slice(0, 5)} 
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
                                dataSource={topScorers.slice(0, 5)} 
                                rowKey="id"
                                pagination={false}
                            />
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                No scorer statistics available
                            </div>
                        )}
                    </Card>

                    <Card
                        title="Top Assists"
                        style={{ marginTop: 16 }}
                        extra={topAssists.length > 0 && (
                            <Button
                                type="link"
                                onClick={() => setAssistsModalVisible(true)}
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
                        ) : topAssists.length > 0 ? (
                            <Table
                                columns={scorerColumns}
                                dataSource={topAssists.slice(0, 5)}
                                rowKey="id"
                                pagination={false}
                            />
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                No assist statistics available
                            </div>
                        )}
                    </Card>
                    <Card
                        title="Top Yellow Cards"
                        style={{ marginTop: 16 }}
                        extra={topYellowCards.length > 0 && (
                            <Button
                                type="link"
                                onClick={() => setYellowCardsModalVisible(true)}
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
                        ) : topYellowCards.length > 0 ? (
                            <Table
                                columns={cardColumns}
                                dataSource={topYellowCards.slice(0, 5)}
                                rowKey="id"
                                pagination={false}
                            />
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                No assist statistics available
                            </div>
                        )}
                    </Card>
                    <Card
                        title="Top Red Cards"
                        style={{ marginTop: 16 }}
                        extra={topRedCards.length > 0 && (
                            <Button
                                type="link"
                                onClick={() => setRedCardsModalVisible(true)}
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
                        ) : topRedCards.length > 0 ? (
                            <Table
                                columns={cardColumns}
                                dataSource={topRedCards.slice(0, 5)}
                                rowKey="id"
                                pagination={false}
                            />
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                No red cards statistics available
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

            <Modal
                title={`${league.name} - Top Assists (${selectedSeason?.name})`}
                open={assistsModalVisible}
                onCancel={() => setAssistsModalVisible(false)}
                width={800}
                footer={null}
            >
                <Table
                    columns={scorerColumns}
                    dataSource={topAssists}
                    rowKey="id"
                    pagination={false}
                />
            </Modal>

            <Modal
                title={`${league.name} - Top Yellow Cards (${selectedSeason?.name})`}
                open={yellowCardsModalVisible}
                onCancel={() => setYellowCardsModalVisible(false)}
                width={800}
                footer={null}
            >
                <Table
                    columns={cardColumns}
                    dataSource={topYellowCards}
                    rowKey="id"
                    pagination={false}
                />
            </Modal>

            <Modal
                title={`${league.name} - Top Red Cards (${selectedSeason?.name})`}
                open={redCardsModalVisible}
                onCancel={() => setRedCardsModalVisible(false)}
                width={800}
                footer={null}
            >
                <Table
                    columns={cardColumns}
                    dataSource={topRedCards}
                    rowKey="id"
                    pagination={false}
                />
            </Modal>
        </div>
    );
};

export default LeagueDetailPage;