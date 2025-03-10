// epl-web/src/components/client/league/league.detail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Col, Row, Typography, Spin, Select, Table, Tabs } from "antd";
import { fetchLeagueDetailAPI } from "../../../services/api.service.js";

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const LeagueDetailPage = () => {
    const [league, setLeague] = useState(null);
    const [loading, setLoading] = useState(true);
    const [seasons, setSeasons] = useState(['2023/2024', '2022/2023', '2021/2022']); // Sample seasons
    const [selectedSeason, setSelectedSeason] = useState('2023/2024');
    const [clubs, setClubs] = useState([]);
    const [matches, setMatches] = useState([]);
    const [topScorers, setTopScorers] = useState([]);
    const [standings, setStandings] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        const fetchLeagueDetail = async () => {
            try {
                const res = await fetchLeagueDetailAPI(id);
                setLeague(res.data);
                // In a real implementation, fetch seasons here
                // const seasonsRes = await fetchLeagueSeasons(id);
                // setSeasons(seasonsRes.data);
            } catch (error) {
                console.error("Failed to fetch league details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeagueDetail();
    }, [id]);

    // Fetch season-specific data when season changes
    useEffect(() => {
        const fetchSeasonData = async () => {
            if (!league) return;

            try {
                // Simulate API calls - replace with actual API calls
                // const clubsRes = await fetchLeagueClubs(id, selectedSeason);
                // setClubs(clubsRes.data);

                // Simulate data for the UI
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

    // Define table columns
    const clubColumns = [
        { title: 'Club', dataIndex: 'name', key: 'name' },
        { title: 'Stadium', dataIndex: 'stadium', key: 'stadium' },
        { title: 'Manager', dataIndex: 'manager', key: 'manager' },
    ];

    const matchColumns = [
        { title: 'Date', dataIndex: 'date', key: 'date' },
        { title: 'Home Team', dataIndex: 'homeTeam', key: 'homeTeam' },
        { title: 'Score', dataIndex: 'score', key: 'score' },
        { title: 'Away Team', dataIndex: 'awayTeam', key: 'awayTeam' },
    ];

    const scorerColumns = [
        { title: 'Rank', dataIndex: 'id', key: 'id' },
        { title: 'Player', dataIndex: 'name', key: 'name' },
        { title: 'Team', dataIndex: 'team', key: 'team' },
        { title: 'Goals', dataIndex: 'goals', key: 'goals' },
    ];

    const standingColumns = [
        { title: 'Pos', dataIndex: 'position', key: 'position', width: 50 },
        { title: 'Team', dataIndex: 'team', key: 'team' },
        { title: 'P', dataIndex: 'played', key: 'played', width: 50 },
        { title: 'Pts', dataIndex: 'points', key: 'points', width: 50 }
    ];

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

                    <Card title="Latest Matchday" style={{ marginTop: 16 }}>
                        <Table
                            columns={matchColumns}
                            dataSource={matches}
                            rowKey="id"
                            pagination={false}
                        />
                    </Card>

                    <Card title="Top Goal Scorers" style={{ marginTop: 16 }}>
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
                    <Card title="League Table">
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
        </div>
    );
};

export default LeagueDetailPage;