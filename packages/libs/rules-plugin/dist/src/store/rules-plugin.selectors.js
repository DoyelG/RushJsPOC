import { createSelector } from 'reselect';
import { rulesetClassifications, rulesetSelectionTypes } from '../constants/rules-plugin.constants';
import { getGeometryCenter } from '../helpers/mapboxgl.helpers';
const { NON_CLASSIFIED } = rulesetClassifications;
export function createRulesPluginSelectors(rulesPluginStoreSliceIds) {
    const storeSelector = state => {
        return rulesPluginStoreSliceIds.reduce((store, storeSliceId) => {
            return store[storeSliceId];
        }, state);
    };
    const getClassifiedLayersStyles = state => storeSelector(state).classifiedLayersStyles;
    const getMapJurisdictions = state => storeSelector(state).mapJurisdictions;
    const getSelectedAdvisory = state => storeSelector(state).selectedAdvisory;
    const getClickedAdvisories = state => storeSelector(state).clickedAdvisories;
    const getIsFetchingClickedAdvisories = state => storeSelector(state).isFetchingClickedAdvisories;
    const getAdvisoriesData = state => storeSelector(state).advisoriesData;
    const getAdvisoriesCounter = state => storeSelector(state).advisoriesCounter;
    const getMapBoundsGeometry = state => storeSelector(state).mapBoundsGeometry;
    const getSelectedRulesets = state => storeSelector(state).selectedRulesets;
    const getIsMapPartiallyOverUnavailableJurisdiction = state => storeSelector(state).isMapPartiallyOverUnavailableJurisdiction;
    const getRulesetInformation = state => storeSelector(state).rulesetInformation;
    const getIsFetchingRulesetInformation = state => storeSelector(state).isFetchingRulesetInformation;
    const getAppliedAdvisoriesFilter = state => storeSelector(state).appliedAdvisoriesFilter;
    const getShouldShowInactiveAdvisories = state => storeSelector(state).shouldShowInactiveAdvisories;
    const getLocationName = state => storeSelector(state).locationName;
    const getLocationWeather = state => storeSelector(state).locationWeather;
    const getZoomLevel = state => storeSelector(state).zoomLevel;
    const getHighlightedLayer = state => storeSelector(state).highlightedLayer;
    const getUnclassifiedLayersStyles = createSelector(getClassifiedLayersStyles, layers => layers.filter(layer => layer.id.includes(NON_CLASSIFIED)));
    const getRulesets = createSelector(getMapJurisdictions, jurisdictions => {
        const rulesets = [];
        for (const jurisdiction in jurisdictions) {
            jurisdictions[jurisdiction].rulesets.forEach(ruleset => rulesets.push(ruleset));
        }
        return rulesets;
    });
    const getRulesetsIds = createSelector(getRulesets, rulesets => rulesets.map(ruleset => ruleset.id).join());
    const getSelectedRulesetsBySource = createSelector(getSelectedRulesets, selectedRulesets => {
        return Object.values(selectedRulesets).reduce((allSelectedRulesets, ruleset) => {
            return {
                ...allSelectedRulesets,
                ...ruleset
            };
        }, {});
    });
    const getVisibleRulesetsIds = createSelector(getRulesets, getSelectedRulesetsBySource, (rulesets, selectedRulesetsBySource) => {
        return rulesets
            .reduce((rulesetsIds, ruleset) => {
            const selectedRuleset = selectedRulesetsBySource[ruleset.id];
            const isDefault = Boolean(ruleset.default);
            const isRequired = ruleset.selection_type === rulesetSelectionTypes.REQUIRED;
            if (selectedRuleset) {
                if (selectedRuleset.visibility === 'visible') {
                    return [...rulesetsIds, ruleset.id];
                }
            }
            else if (isDefault || isRequired) {
                return [...rulesetsIds, ruleset.id];
            }
            return rulesetsIds;
        }, [])
            .join();
    });
    const getParsedRulesetInformation = createSelector(getRulesetInformation, rulesetInformation => {
        return rulesetInformation.map(rulesetInfo => {
            rulesetInfo.rules = rulesetInfo.rules
                .sort((a, b) => {
                if (a.description < b.description) {
                    return -1;
                }
                else if (a.description === b.description) {
                    return 0;
                }
                else {
                    return 1;
                }
            })
                .reduce((filteredRules, rule, index) => {
                const isLastRule = index === rulesetInfo.rules.length - 1;
                if (isLastRule) {
                    filteredRules.push(rule);
                }
                else {
                    if (rulesetInfo.rules[index].description !== rulesetInfo.rules[index + 1].description) {
                        filteredRules.push(rule);
                    }
                }
                return filteredRules;
            }, []);
            return rulesetInfo;
        });
    });
    const getMapBoundsGeometryCenter = createSelector(getMapBoundsGeometry, mapBoundsGeometry => {
        if (mapBoundsGeometry.type) {
            const [latitude, longitude] = getGeometryCenter(mapBoundsGeometry);
            return { latitude, longitude };
        }
        else {
            return {};
        }
    });
    return {
        getClassifiedLayersStyles,
        getMapJurisdictions,
        getSelectedAdvisory,
        getClickedAdvisories,
        getIsFetchingClickedAdvisories,
        getAdvisoriesData,
        getAdvisoriesCounter,
        getMapBoundsGeometry,
        getSelectedRulesets,
        getIsMapPartiallyOverUnavailableJurisdiction,
        getRulesetInformation,
        getIsFetchingRulesetInformation,
        getAppliedAdvisoriesFilter,
        getShouldShowInactiveAdvisories,
        getLocationName,
        getLocationWeather,
        getZoomLevel,
        getHighlightedLayer,
        getUnclassifiedLayersStyles,
        getRulesets,
        getRulesetsIds,
        getSelectedRulesetsBySource,
        getVisibleRulesetsIds,
        getParsedRulesetInformation,
        getMapBoundsGeometryCenter
    };
}
