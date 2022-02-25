import settings from 'settings';
import axiosInstance, { axiosInstanceWithoutAuth } from 'projects/web-app/utilities/apiRequests/axiosInstance';
import moment from 'moment';
const { urls: { advisoryApiUrl, rulesUrl, weatherApiUrl }, api: { version: { rules } } } = settings;
export const getMapStyles = (baseUrl, mapStylesVersion, theme) => {
    return fetch(`${baseUrl}/${mapStylesVersion}/${theme}.json`).then(response => response.json());
};
export const getAdvisoriesByGeometryAndRulesets = data => {
    return axiosInstance.post(`${advisoryApiUrl}`, data).then(response => response.data.data);
};
export const getRulesetInformation = rulesetId => {
    return axiosInstanceWithoutAuth
        .get(`${rulesUrl}/${rules}/rule`, {
        params: {
            rulesets: rulesetId
        }
    })
        .then(response => response.data.data);
};
export const getWeather = ({ latitude, longitude }) => {
    return axiosInstance
        .get(weatherApiUrl, {
        params: {
            latitude,
            longitude,
            start: moment().toISOString(),
            end: moment().toISOString()
        }
    })
        .then(response => response.data.data.weather[0]);
};
