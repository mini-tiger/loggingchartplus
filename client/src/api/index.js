import axios from 'axios';
import config from "../../config"

export async function login(params) {
    return axios({
        url: '/' + config.urlSuffix + '/api/login',
        method: 'post',
        data: params,
    });
}

export async function postUserRegister(params) {
    return axios({
        url: '/' + config.urlSuffix + '/api/register',
        method: 'post',
        data: params,
    });
}

export async function postUserLogout() {
    return axios({
        url: '/' + config.urlSuffix + '/api/logout',
        method: 'post',
    });
}

export async function getUserProfile() {
    return axios('/' + config.urlSuffix + '/api/profile');
}

export default {
    login,
    postUserRegister,
    postUserLogout,
    getUserProfile,
};
