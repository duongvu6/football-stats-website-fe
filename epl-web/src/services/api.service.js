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

const getAccountAPI = () => {
    const URL_BACKEND = "/api/v1/auth/account";
    return axios.get(URL_BACKEND);
}

const logoutAPI = () => {
    const URL_BACKEND = "/api/v1/auth/logout";
    return axios.post(URL_BACKEND);
}

export {
    loginAPI,
    registerUserAPI,
    logoutAPI,
    getAccountAPI

}

