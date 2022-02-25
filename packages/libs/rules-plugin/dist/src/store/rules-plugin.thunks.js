import moment from 'moment';
import { getAdvisoriesByGeometryAndRulesets, getRulesetInformation } from '../api-requests/rules-plugin.api-requests';
import { parseAdvisoriesByType, sortAdvisories, getClickedGeometry } from '../helpers/rules-plugin.helpers';
import { getLocationNameByCoordinates } from '../helpers/mapboxgl.helpers';
import { getWeather } from '../api-requests/rules-plugin.api-requests';
export function createRulesPluginThunks(rulesPluginActions, rulesPluginSelectors) {
    const { setClickedAdvisories, setAdvisories, setIsFetchingRulesetInformation, setRulesetInformation, setLocationName, setLocationWeather } = rulesPluginActions;
    const { getAppliedAdvisoriesFilter } = rulesPluginSelectors;
    const fetchClickedAdvisories = ({ lngLat, advisoryId, rulesetsIds }) => {
        return async (dispatch, getState) => {
            const { geometry } = getClickedGeometry(lngLat);
            const appliedAdvisoriesFilter = getAppliedAdvisoriesFilter(getState());
            const now = moment();
            const inFourHours = moment().add(4, 'hours');
            const data = {
                rulesets: rulesetsIds,
                geometry,
                start: appliedAdvisoriesFilter.start || now,
                end: appliedAdvisoriesFilter.end || inFourHours
            };
            try {
                const { advisories } = await getAdvisoriesByGeometryAndRulesets(data);
                const sortedAdvisories = sortAdvisories({ advisories, advisoryId });
                dispatch(setClickedAdvisories(sortedAdvisories));
            }
            catch (error) {
                console.warn('Error retrieving advisories', error);
            }
        };
    };
    const fetchAdvisories = ({ rulesetsIds, mapBoundsGeometry }) => {
        return async (dispatch, getState) => {
            const state = getState();
            const appliedAdvisoriesFilter = getAppliedAdvisoriesFilter(state);
            const now = moment();
            const inFourHours = moment().add(4, 'hours');
            const data = {
                rulesets: rulesetsIds,
                geometry: mapBoundsGeometry,
                start: appliedAdvisoriesFilter.start || now,
                end: appliedAdvisoriesFilter.end || inFourHours
            };
            try {
                const { advisories, color } = await getAdvisoriesByGeometryAndRulesets(data);
                const advisoriesCounter = advisories.length;
                const parsedAdvisories = {
                    color,
                    advisories: parseAdvisoriesByType(advisories)
                };
                dispatch(setAdvisories({
                    parsedAdvisories,
                    advisoriesCounter
                }));
            }
            catch (error) {
                console.warn('Error retrieving advisories', error);
            }
        };
    };
    const fetchRulesetInformation = rulesetId => {
        return async (dispatch) => {
            dispatch(setIsFetchingRulesetInformation(true));
            try {
                const rulesetInfo = await getRulesetInformation(rulesetId);
                dispatch(setRulesetInformation(rulesetInfo));
            }
            catch (error) {
                console.warn('Error retrieving information', error);
            }
            finally {
                dispatch(setIsFetchingRulesetInformation(false));
            }
        };
    };
    const fetchLocationName = ({ geometry, zoomLevel }) => {
        return async (dispatch) => {
            try {
                const locationNameResponse = await getLocationNameByCoordinates({ geometry, zoomLevel });
                dispatch(setLocationName(locationNameResponse));
            }
            catch (error) {
                console.warn('fetchLocationName', error);
            }
        };
    };
    const fetchWeather = ({ latitude, longitude }) => {
        return async (dispatch) => {
            try {
                const weatherResponse = await getWeather({ latitude, longitude });
                dispatch(setLocationWeather(weatherResponse || {}));
            }
            catch (error) {
                console.warn('fetchWeather', error);
            }
        };
    };
    return {
        fetchClickedAdvisories,
        fetchAdvisories,
        fetchLocationName,
        fetchRulesetInformation,
        fetchWeather
    };
}
