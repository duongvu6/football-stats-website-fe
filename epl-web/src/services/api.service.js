import axios from "./axios.customize";
// import axios from "axios";
const loginAPI = (email, password) => {
    const URL_BACKEND = "/api/v1/auth/login";
    const data = {
        username: email,
        password: password
    }
    return axios.post(URL_BACKEND, data)

}
const registerUserAPI = (fullName,email,password) =>{
    const URL_BACKEND = "/api/v1/auth/register";
    const data = {
        name:fullName,
        email:email,
        password:password,
    }
    return  axios.post(URL_BACKEND,data);
}

const fetchAllPlayersAPI = (currentOrParams, pageSize) => {
    // Check if first parameter is an object (params) or a number (current page)
    if (typeof currentOrParams === 'object') {
        const params = currentOrParams;
        let url = `/api/v1/players?sortTransferHistory=true`;

        // Add pagination parameters
        if (params.page) url += `&page=${params.page}`;
        if (params.size) url += `&size=${params.size}`;

        // Add filter if present
        if (params.filter) url += `&filter=${encodeURIComponent(params.filter)}`;

        // Add sort if present
        if (params.sort) url += `&sort=${encodeURIComponent(params.sort)}`;

        return axios.get(url);
    } else {
        // Original implementation for backward compatibility
        const URL_BACKEND = `/api/v1/players?page=${currentOrParams}&size=${pageSize}&sortTransferHistory=true`;
        return axios.get(URL_BACKEND);
    }
}
const fetchAllPlayersNoPaginationAPI = () => {
    const URL_BACKEND = `/api/v1/players`;
    return axios.get(URL_BACKEND);
}

// Add these to existing export functions
const createPlayerAPI = (playerData) => {
    const URL_BACKEND = "/api/v1/players";
    return axios.post(URL_BACKEND, playerData);
}

const updatePlayerAPI = (playerData) => {
    const URL_BACKEND = `/api/v1/players`;
    return axios.put(URL_BACKEND, playerData);
}

const deletePlayerAPI = (id) => {
    const URL_BACKEND = `/api/v1/players/${id}`;
    return axios.delete(URL_BACKEND);
}

const getAccountAPI = () => {
    const URL_BACKEND = "/api/v1/auth/account";
    return axios.get(URL_BACKEND);
}

const logoutAPI = () => {
    const URL_BACKEND = "/api/v1/auth/logout";
    return axios.post(URL_BACKEND);
}
const fetchPlayerDetailAPI = (id) => {
    const URL_BACKEND = `/api/v1/players/${id}?sortTransferHistory=true`;
    return axios.get(URL_BACKEND);
}
const fetchAllClubsAPI = () => {
    const URL_BACKEND = `/api/v1/clubs`;
    return axios.get(URL_BACKEND);
}
const updateTransferAPI = (data) => {
    const URL_BACKEND = `/api/v1/transfers`;
    return axios.put(URL_BACKEND, data);
};
const deleteTransferAPI = (id) => {
    const URL_BACKEND = `/api/v1/transfers/${id}`;
    return axios.delete(URL_BACKEND);
}
const fetchAllClubsWithPaginationAPI = (currentOrParams, pageSize) => {
    // Check if first parameter is an object (params) or a number (current page)
    if (typeof currentOrParams === 'object') {
        const params = currentOrParams;
        let url = `/api/v1/clubs?`;

        // Add pagination parameters
        if (params.page) url += `&page=${params.page}`;
        if (params.size) url += `&size=${params.size}`;

        // Add filter if present
        if (params.filter) url += `&filter=${encodeURIComponent(params.filter)}`;

        // Add sort if present
        if (params.sort) url += `&sort=${encodeURIComponent(params.sort)}`;

        return axios.get(url);
    } else {
        // Original implementation
        const URL_BACKEND = `/api/v1/clubs?page=${currentOrParams}&size=${pageSize}`;
        return axios.get(URL_BACKEND);
    }
}
const fetchClubDetailAPI = (id) => {
    const URL_BACKEND = `/api/v1/clubs/${id}`;
    return axios.get(URL_BACKEND);
}
const createClubAPI = (data) => {
    const URL_BACKEND = `/api/v1/clubs`;
    return axios.post(URL_BACKEND, data);
}
const editClubAPI = (data) => {
    const URL_BACKEND = `/api/v1/clubs`;
    return axios.put(URL_BACKEND, data);
}
const deleteClubAPI = (id) => {
    const URL_BACKEND = `/api/v1/clubs/${id}`;
    return axios.delete(URL_BACKEND);
}
const fetchAllCoachesAPI = (currentOrParams, pageSize) => {
    // Check if first parameter is an object (params) or a number (current page)
    if (typeof currentOrParams === 'object') {
        const params = currentOrParams;
        let url = `/api/v1/coaches?sortTransferHistory=true`;

        // Add pagination parameters
        if (params.page) url += `&page=${params.page}`;
        if (params.size) url += `&size=${params.size}`;

        // Add filter if present
        if (params.filter) url += `&filter=${encodeURIComponent(params.filter)}`;

        // Add sort if present
        if (params.sort) url += `&sort=${encodeURIComponent(params.sort)}`;

        return axios.get(url);
    } else {
        // Original implementation
        const URL_BACKEND = `/api/v1/coaches?page=${currentOrParams}&size=${pageSize}&sortTransferHistory=true`;
        return axios.get(URL_BACKEND);
    }
}
const fetchCoachDetailAPI = (id) => {
    const URL_BACKEND = `/api/v1/coaches/${id}?sortCoachClubs=true`;
    return axios.get(URL_BACKEND);
}
const createTransferHistoryAPI = (data) => {
    const URL_BACKEND = `/api/v1/transfers`;
    return axios.post(URL_BACKEND, data);
}
const createCoachAPI = (data) => {
    const URL_BACKEND = `/api/v1/coaches`;
    return axios.post(URL_BACKEND, data);
}
const updateCoachAPI = (data) => {
    const URL_BACKEND = `/api/v1/coaches`;
    return axios.put(URL_BACKEND, data);
}
const deleteCoachAPI = (id) => {
    const URL_BACKEND = `/api/v1/coaches/${id}`;
    return axios.delete(URL_BACKEND);
}
// Coach Club API endpoints
const createCoachClubAPI = (data) => {
    const URL_BACKEND = `/api/v1/coach-clubs`;
    return axios.post(URL_BACKEND, data);
};

const updateCoachClubAPI = (data) => {
    const URL_BACKEND = `/api/v1/coach-clubs`;
    return axios.put(URL_BACKEND, data);
};

const deleteCoachClubAPI = (id) => {
    const URL_BACKEND = `/api/v1/coach-clubs/${id}`;
    return axios.delete(URL_BACKEND);
};

const fetchAllLeaguesAPI = (currentOrParams, pageSize) => {
    // Check if first parameter is an object (params) or a number (current page)
    if (typeof currentOrParams === 'object') {
        const params = currentOrParams;
        let url = `/api/v1/leagues?`;

        // Add pagination parameters
        if (params.page) url += `&page=${params.page}`;
        if (params.size) url += `&size=${params.size}`;

        // Add filter if present
        if (params.filter) url += `&filter=${encodeURIComponent(params.filter)}`;

        // Add sort if present
        if (params.sort) url += `&sort=${encodeURIComponent(params.sort)}`;

        return axios.get(url);
    } else {
        // Original implementation
        const URL_BACKEND = `/api/v1/leagues?page=${currentOrParams}&size=${pageSize}`;
        return axios.get(URL_BACKEND);
    }
}

const createLeagueAPI = (leagueData) => {
    const URL_BACKEND = "/api/v1/leagues";
    return axios.post(URL_BACKEND, leagueData);
}

const updateLeagueAPI = (leagueData) => {
    const URL_BACKEND = `/api/v1/leagues`;
    return axios.put(URL_BACKEND, leagueData);
}

const deleteLeagueAPI = (id) => {
    const URL_BACKEND = `/api/v1/leagues/${id}`;
    return axios.delete(URL_BACKEND);
}

const fetchLeagueDetailAPI = (id) => {
    const URL_BACKEND = `/api/v1/leagues/${id}`;
    return axios.get(URL_BACKEND);
}
const createLeagueSeasonAPI = (data) => {
    const URL_BACKEND = `/api/v1/league-seasons`;
    return axios.post(URL_BACKEND, data);
}

const updateLeagueSeasonAPI = (data) => {
    const URL_BACKEND = `/api/v1/league-seasons`;
    return axios.put(URL_BACKEND, data);
}

const deleteLeagueSeasonAPI = (id) => {
    const URL_BACKEND = `/api/v1/league-seasons/${id}`;
    return axios.delete(URL_BACKEND);
}

// League Season detailed API endpoints
const fetchLeagueSeasonDetailAPI = (id) => {
    const URL_BACKEND = `/api/v1/league-seasons/${id}`;
    return axios.get(URL_BACKEND);
};

const createClubSeasonTableAPI = (data) => {
    const URL_BACKEND = `/api/v1/club-season-tables`;
    return axios.post(URL_BACKEND, data);
};

const updateClubSeasonTableAPI = (data) => {
    const URL_BACKEND = `/api/v1/club-season-tables`;
    return axios.put(URL_BACKEND, data);
};
const deleteClubSeasonTableAPI = (id) => {
    const URL_BACKEND = `/api/v1/club-season-tables/${id}`;
    return axios.delete(URL_BACKEND);
}

// Match API endpoints
const fetchMatchesBySeasonAPI = (seasonId) => {
    const URL_BACKEND = `/api/v1/matches?filter=season:${seasonId}&sort=round,asc`;
    return axios.get(URL_BACKEND);
};

const fetchMatchDetailAPI = (id) => {
    const URL_BACKEND = `/api/v1/matches/${id}`;
    return axios.get(URL_BACKEND);
};

const createMatchAPI = (data) => {
    const URL_BACKEND = `/api/v1/matches`;
    return axios.post(URL_BACKEND, data);
};

const updateMatchAPI = (data) => {
    const URL_BACKEND = `/api/v1/matches`;
    return axios.put(URL_BACKEND, data);
};

const deleteMatchAPI = (id) => {
    const URL_BACKEND = `/api/v1/matches/${id}`;
    return axios.delete(URL_BACKEND);
};

// Match Action API endpoints
const fetchMatchActionsAPI = (matchId) => {
    const URL_BACKEND = `/api/v1/match-actions?filter=match:${matchId}`;
    return axios.get(URL_BACKEND);
};

const createMatchActionAPI = (data) => {
    const URL_BACKEND = `/api/v1/match-actions`;
    return axios.post(URL_BACKEND, data);
};

const updateMatchActionAPI = (data) => {
    const URL_BACKEND = `/api/v1/match-actions`;
    return axios.put(URL_BACKEND, data);
};

const deleteMatchActionAPI = (id) => {
    const URL_BACKEND = `/api/v1/match-actions/${id}`;
    return axios.delete(URL_BACKEND);
};

const getTopGoalScorerAPI = (seasonId) => {
    const URL_BACKEND = `/api/v1/league-seasons/${seasonId}/top-goal-scorers`;
    return axios.get(URL_BACKEND);
}

const getTopAssistsAPI = (seasonId) => {
    const URL_BACKEND = `/api/v1/league-seasons/${seasonId}/top-assists`;
    return axios.get(URL_BACKEND);
}
const getTopYellowCardsAPI = (seasonId) => {
    const URL_BACKEND = `/api/v1/league-seasons/${seasonId}/top-yellow-cards`;
    return axios.get(URL_BACKEND);
}
const getTopRedCardsAPI = (seasonId) => {
    const URL_BACKEND = `/api/v1/league-seasons/${seasonId}/top-red-cards`;
    return axios.get(URL_BACKEND);
}

const getClubSquadAPI = (clubId, seasonId) => {
    const URL_BACKEND = `/api/v1/clubs/${clubId}/squad?seasonId=${seasonId}`;
    return axios.get(URL_BACKEND);
};

const getClubTransfersAPI = (clubId, seasonId) => {
    const URL_BACKEND = `/api/v1/clubs/${clubId}/transfers?seasonId=${seasonId}`;
    return axios.get(URL_BACKEND);
};
const getClubSeasonsAPI = (clubId) => {
    const URL_BACKEND = `/api/v1/clubs/${clubId}/seasons`;
    return axios.get(URL_BACKEND);
}

// Get club top scorers for a specific season
const getClubTopScorersAPI = (seasonId, clubId) => {
    const URL_BACKEND = `/api/v1/league-seasons/${seasonId}/clubs/${clubId}/top-goal-scorers`;
    return axios.get(URL_BACKEND);
};

// Get club top assists for a specific season
const getClubTopAssistsAPI = (seasonId, clubId) => {
    const URL_BACKEND = `/api/v1/league-seasons/${seasonId}/clubs/${clubId}/top-assists`;
    return axios.get(URL_BACKEND);
};

export {
    loginAPI,
    registerUserAPI,
    logoutAPI,
    getAccountAPI,
    fetchAllPlayersAPI,
    fetchPlayerDetailAPI,
    createPlayerAPI,
    updatePlayerAPI,
    deletePlayerAPI,
    fetchAllClubsAPI,
    updateTransferAPI,
    deleteTransferAPI,
    fetchAllClubsWithPaginationAPI,
    fetchClubDetailAPI,
    createClubAPI,
    editClubAPI,
    deleteClubAPI,
    fetchAllCoachesAPI,
    fetchCoachDetailAPI,
    createCoachAPI,
    updateCoachAPI,
    deleteCoachAPI,
    createTransferHistoryAPI,
    createCoachClubAPI,
    updateCoachClubAPI,
    deleteCoachClubAPI,
    fetchAllLeaguesAPI,
    createLeagueAPI,
    updateLeagueAPI,
    deleteLeagueAPI,
    fetchLeagueDetailAPI,
    createLeagueSeasonAPI,
    updateLeagueSeasonAPI,
    deleteLeagueSeasonAPI,
    fetchLeagueSeasonDetailAPI,
    createClubSeasonTableAPI,
    updateClubSeasonTableAPI,
    deleteClubSeasonTableAPI,
    fetchMatchesBySeasonAPI,
    fetchMatchDetailAPI,
    createMatchAPI,
    updateMatchAPI,
    deleteMatchAPI,
    fetchMatchActionsAPI,
    createMatchActionAPI,
    updateMatchActionAPI,
    deleteMatchActionAPI,
    fetchAllPlayersNoPaginationAPI,
    getTopGoalScorerAPI,
    getTopAssistsAPI,
    getTopYellowCardsAPI,
    getTopRedCardsAPI,
    getClubSquadAPI,
    getClubTransfersAPI,
    getClubSeasonsAPI,
    getClubTopScorersAPI,
    getClubTopAssistsAPI
}

