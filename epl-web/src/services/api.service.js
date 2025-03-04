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

const fetchAllPlayersAPI = (current, pageSize) => {
    const URL_BACKEND = `/api/v1/players?page=${current}&size=${pageSize}&sortTransferHistory=true`;
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
const fetchAllClubsWithPaginationAPI = (current, pageSize) => {
    const URL_BACKEND = `/api/v1/clubs?page=${current}&size=${pageSize}`;
    return axios.get(URL_BACKEND);
}
const fetchAllCoachesAPI = (current, pageSize) => {
    const URL_BACKEND = `/api/v1/coaches?page=${current}&size=${pageSize}&sortTransferHistory=true`;
    return axios.get(URL_BACKEND);
}
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
    fetchAllCoachesAPI


}

