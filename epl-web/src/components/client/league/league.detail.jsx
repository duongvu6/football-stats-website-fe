import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Col, Row, Typography, Spin, Select, Table, Tabs, Button, Modal } from "antd";
import { BarChartOutlined, CalendarOutlined, TrophyOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { fetchLeagueDetailAPI } from "../../../services/api.service.js";

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const LeagueDetailPage = () => {
    // State variables remain the same
    const [league, setLeague] = useState(null);
    const [loading, setLoading] = useState(true);
    const [seasons, setSeasons] = useState(['2023/2024', '2022/2023', '2021/2022']);
    const [selectedSeason, setSelectedSeason] = useState('2023/2024');
    const [clubs, setClubs] = useState([]);
    const [matches, setMatches] = useState([]);
    const [topScorers, setTopScorers] = useState([]);
    const [standings, setStandings] = useState([]);
    const { id } = useParams();

    // Modal states
    const [matchdayModalVisible, setMatchdayModalVisible] = useState(false);
    const [standingsModalVisible, setStandingsModalVisible] = useState(false);
    const [scorersModalVisible, setScorersModalVisible] = useState(false);

    // The useEffect hooks remain the same
    useEffect(() => {
        const fetchLeagueDetail = async () => {
            try {
                const res = await fetchLeagueDetailAPI(id);
                setLeague(res.data);
                // In a real implementation, fetch seasons here
            } catch (error) {
                console.error("Failed to fetch league details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeagueDetail();
    }, [id]);

    useEffect(() => {
        const fetchSeasonData = async () => {
            if (!league) return;

            try {
                // Simulate data loading...
                setClubs([
                    { id: 1, name: 'Manchester United', stadium: 'Old Trafford', manager: 'Erik ten Hag' },
                    { id: 2, name: 'Liverpool', stadium: 'Anfield', manager: 'Jürgen Klopp' },
                    { id: 3, name: 'Arsenal', stadium: 'Emirates Stadium', manager: 'Mikel Arteta' },
                    { id: 4, name: 'Manchester City', stadium: 'Etihad Stadium', manager: 'Pep Guardiola' },
                    { id: 5, name: 'Chelsea', stadium: 'Stamford Bridge', manager: 'Mauricio Pochettino' }
                ]);

                setMatches([
                    { id: 1, homeTeam: 'Manchester United', awayTeam: 'Liverpool', score: '2-1', date: '2023-10-15' },
                    { id: 2, homeTeam: 'Arsenal', awayTeam: 'Chelsea', score: '1-1', date: '2023-10-15' },
                    { id: 3, homeTeam: 'Manchester City', awayTeam: 'Tottenham', score: '3-0', date: '2023-10-14' },
                ]);

                setTopScorers([
                    { id: 1, name: 'Erling Haaland', team: 'Manchester City', goals: 15 },
                    { id: 2, name: 'Mohamed Salah', team: 'Liverpool', goals: 12 },
                    { id: 3, name: 'Son Heung-min', team: 'Tottenham', goals: 10 },
                    { id: 4, name: 'Bruno Fernandes', team: 'Manchester United', goals: 9 },
                    { id: 5, name: 'Bukayo Saka', team: 'Arsenal', goals: 8 },
                ]);

                setStandings([
                    { position: 1, team: 'Manchester City', played: 10, won: 8, drawn: 1, lost: 1, points: 25 },
                    { position: 2, team: 'Arsenal', played: 10, won: 7, drawn: 2, lost: 1, points: 23 },
                    { position: 3, team: 'Liverpool', played: 10, won: 7, drawn: 1, lost: 2, points: 22 },
                    { position: 4, team: 'Tottenham', played: 10, won: 6, drawn: 2, lost: 2, points: 20 },
                    { position: 5, team: 'Manchester United', played: 10, won: 5, drawn: 3, lost: 2, points: 18 },
                ]);
            } catch (error) {
                console.error("Failed to fetch season data:", error);
            }
        };

        fetchSeasonData();
    }, [league, selectedSeason, id]);

    // Loading and null checks remain the same
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
            sorter: (a, b) => new Date(a.date) - new Date(b.date)
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
            dataIndex: "id",
            key: "id",
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
            render: () => Math.floor(Math.random() * 30) + 10,
            sorter: (a, b) => {
                const aGF = Math.floor(Math.random() * 30) + 10;
                const bGF = Math.floor(Math.random() * 30) + 10;
                return aGF - bGF;
            }
        },
        {
            title: "GA",
            dataIndex: "goalsAgainst",
            key: "goalsAgainst",
            render: () => Math.floor(Math.random() * 20) + 5,
            sorter: (a, b) => {
                const aGA = Math.floor(Math.random() * 20) + 5;
                const bGA = Math.floor(Math.random() * 20) + 5;
                return aGA - bGA;
            }
        },
        {
            title: "GD",
            dataIndex: "goalDifference",
            key: "goalDifference",
            render: (_, record) => {
                const gf = Math.floor(Math.random() * 30) + 10;
                const ga = Math.floor(Math.random() * 20) + 5;
                return gf - ga;
            },
            sorter: (a, b) => {
                const aGF = Math.floor(Math.random() * 30) + 10;
                const aGA = Math.floor(Math.random() * 20) + 5;
                const bGF = Math.floor(Math.random() * 30) + 10;
                const bGA = Math.floor(Math.random() * 20) + 5;
                return (aGF - aGA) - (bGF - bGA);
            }
        },
        {
            title: "Pts",
            dataIndex: "points",
            key: "points",
            sorter: (a, b) => a.points - b.points,
            defaultSortOrder: 'descend'
        }
    ];

    // The JSX return remains mostly the same, just ensuring we're using the updated column definitions
    return (
        <div style={{ padding: "30px" }}>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Title level={2}>{league.name}</Title>
                            <Select
                                value={selectedSeason}
                                style={{ width: 150 }}
                                onChange={value => setSelectedSeason(value)}
                            >
                                {seasons.map(season => (
                                    <Option key={season} value={season}>{season}</Option>
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
                        <Table
                            columns={clubColumns}
                            dataSource={clubs}
                            rowKey="id"
                            pagination={false}
                        />
                    </Card>

                    <Card
                        title="Latest Matchday"
                        style={{ marginTop: 16 }}
                        extra={
                            <Button
                                type="link"
                                onClick={() => setMatchdayModalVisible(true)}
                                icon={<ArrowRightOutlined />}
                            >
                                See All Matchdays
                            </Button>
                        }
                    >
                        <Table
                            columns={matchColumns}
                            dataSource={matches}
                            rowKey="id"
                            pagination={false}
                        />
                    </Card>

                    <Card
                        title="Top Goal Scorers"
                        style={{ marginTop: 16 }}
                        extra={
                            <Button
                                type="link"
                                onClick={() => setScorersModalVisible(true)}
                                icon={<ArrowRightOutlined />}
                            >
                                See Full List
                            </Button>
                        }
                    >
                        <Table
                            columns={scorerColumns}
                            dataSource={topScorers}
                            rowKey="id"
                            pagination={false}
                        />
                    </Card>
                </Col>

                {/* Right sidebar */}
                <Col xs={24} md={7}>
                    <Card
                        title="League Table"
                        extra={
                            <Button
                                type="link"
                                onClick={() => setStandingsModalVisible(true)}
                                icon={<ArrowRightOutlined />}
                            >
                                Full Table
                            </Button>
                        }
                    >
                        <Table
                            columns={standingColumns}
                            dataSource={standings}
                            rowKey="position"
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>

            {/* Modals for detailed views */}
            <Modal
                title={`${league.name} - All Matchdays (${selectedSeason})`}
                open={matchdayModalVisible}
                onCancel={() => setMatchdayModalVisible(false)}
                width={800}
                footer={null}
            >
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Matchday 10" key="1">
                        <Table
                            columns={matchColumns}
                            dataSource={matches}
                            rowKey="id"
                            pagination={false}
                        />
                    </TabPane>
                    <TabPane tab="Matchday 9" key="2">
                        <Table
                            columns={matchColumns}
                            dataSource={[
                                { id: 4, homeTeam: 'Chelsea', awayTeam: 'Arsenal', score: '2-2', date: '2023-10-08' },
                                { id: 5, homeTeam: 'Liverpool', awayTeam: 'Manchester City', score: '0-1', date: '2023-10-08' },
                                { id: 6, homeTeam: 'Tottenham', awayTeam: 'Manchester United', score: '2-0', date: '2023-10-07' },
                            ]}
                            rowKey="id"
                            pagination={false}
                        />
                    </TabPane>
                    <TabPane tab="Matchday 8" key="3">
                        <Table
                            columns={matchColumns}
                            dataSource={[
                                { id: 7, homeTeam: 'Manchester United', awayTeam: 'Chelsea', score: '1-1', date: '2023-10-01' },
                                { id: 8, homeTeam: 'Arsenal', awayTeam: 'Tottenham', score: '3-1', date: '2023-10-01' },
                                { id: 9, homeTeam: 'Liverpool', awayTeam: 'West Ham', score: '2-0', date: '2023-09-30' },
                            ]}
                            rowKey="id"
                            pagination={false}
                        />
                    </TabPane>
                </Tabs>
            </Modal>

            <Modal
                title={`${league.name} - Full Standings (${selectedSeason})`}
                open={standingsModalVisible}
                onCancel={() => setStandingsModalVisible(false)}
                width={1000}
                footer={null}
            >
                <Table
                    columns={detailedStandingColumns}
                    dataSource={[
                        ...standings,
                        { position: 6, team: 'Newcastle', played: 10, won: 5, drawn: 2, lost: 3, points: 17 },
                        { position: 7, team: 'Brighton', played: 10, won: 5, drawn: 2, lost: 3, points: 17 },
                        { position: 8, team: 'West Ham', played: 10, won: 4, drawn: 3, lost: 3, points: 15 },
                        { position: 9, team: 'Aston Villa', played: 10, won: 4, drawn: 2, lost: 4, points: 14 },
                        { position: 10, team: 'Crystal Palace', played: 10, won: 3, drawn: 4, lost: 3, points: 13 },
                        { position: 11, team: 'Everton', played: 10, won: 3, drawn: 3, lost: 4, points: 12 },
                        { position: 12, team: 'Leicester', played: 10, won: 3, drawn: 3, lost: 4, points: 12 },
                        { position: 13, team: 'Brentford', played: 10, won: 2, drawn: 5, lost: 3, points: 11 },
                        { position: 14, team: 'Leeds', played: 10, won: 2, drawn: 4, lost: 4, points: 10 },
                        { position: 15, team: 'Southampton', played: 10, won: 2, drawn: 3, lost: 5, points: 9 },
                        { position: 16, team: 'Wolves', played: 10, won: 2, drawn: 3, lost: 5, points: 9 },
                        { position: 17, team: 'Fulham', played: 10, won: 2, drawn: 2, lost: 6, points: 8 },
                        { position: 18, team: 'Bournemouth', played: 10, won: 1, drawn: 4, lost: 5, points: 7 },
                        { position: 19, team: 'Nottingham Forest', played: 10, won: 1, drawn: 3, lost: 6, points: 6 },
                        { position: 20, team: 'Norwich', played: 10, won: 0, drawn: 3, lost: 7, points: 3 },
                    ]}
                    rowKey="position"
                    pagination={false}
                    scroll={{ x: 800 }}
                />
            </Modal>

            <Modal
                title={`${league.name} - Top Scorers (${selectedSeason})`}
                open={scorersModalVisible}
                onCancel={() => setScorersModalVisible(false)}
                width={800}
                footer={null}
            >
                <Table
                    columns={scorerColumns}
                    dataSource={[
                        ...topScorers,
                        { id: 6, name: 'Harry Kane', team: 'Tottenham', goals: 8 },
                        { id: 7, name: 'Phil Foden', team: 'Manchester City', goals: 7 },
                        { id: 8, name: 'Marcus Rashford', team: 'Manchester United', goals: 7 },
                        { id: 9, name: 'Kevin De Bruyne', team: 'Manchester City', goals: 6 },
                        { id: 10, name: 'Martin Ødegaard', team: 'Arsenal', goals: 6 },
                        { id: 11, name: 'Kai Havertz', team: 'Chelsea', goals: 5 },
                        { id: 12, name: 'Luis Diaz', team: 'Liverpool', goals: 5 },
                        { id: 13, name: 'Callum Wilson', team: 'Newcastle', goals: 5 },
                        { id: 14, name: 'Gabriel Jesus', team: 'Arsenal', goals: 4 },
                        { id: 15, name: 'Jack Grealish', team: 'Manchester City', goals: 4 },
                    ]}
                    rowKey="id"
                    pagination={false}
                />
            </Modal>
        </div>
    );
};

export default LeagueDetailPage;