import { connect } from 'react-redux';
import { RulesPlugin } from './RulesPlugin.component';
import { createRulesPluginStore } from './store/rules-plugin.reducer';
import { createRulesPluginSelectors } from './store/rules-plugin.selectors';
import { createRulesPluginActions } from './store/rules-plugin.actions';
import { createRulesPluginThunks } from './store/rules-plugin.thunks';
const rulesPluginId = 'rulesPluginDefault';
export function createRulesPluginContainer(rulesPluginStoreSliceIds = [rulesPluginId]) {
    const rulesPluginStore = createRulesPluginStore(rulesPluginStoreSliceIds.join());
    const rulesPluginSelectors = createRulesPluginSelectors(rulesPluginStoreSliceIds);
    const rulesPluginActions = createRulesPluginActions(rulesPluginStoreSliceIds.join());
    const rulesPluginThunks = createRulesPluginThunks(rulesPluginActions, rulesPluginSelectors);
    const { getClassifiedLayersStyles, getUnclassifiedLayersStyles, getMapJurisdictions, getClickedAdvisories, getSelectedAdvisory, getIsFetchingClickedAdvisories, getMapBoundsGeometry, getSelectedRulesetsBySource, getVisibleRulesetsIds, getAppliedAdvisoriesFilter, getShouldShowInactiveAdvisories, getHighlightedLayer, getLocationName, getLocationWeather, getMapBoundsGeometryCenter, getAdvisoriesData, getAdvisoriesCounter, getZoomLevel, getSelectedRulesets, getIsMapPartiallyOverUnavailableJurisdiction, getParsedRulesetInformation, getIsFetchingRulesetInformation } = rulesPluginSelectors;
    const { setMapJurisdictions, setSelectedAdvisory, clearSelectedAdvisory, clearClickedAdvisories, setMapBoundsGeometry, setClassifiedLayers, setIsMapPartiallyOverUnavailableJurisdiction, setZoomLevel, setHighlightedLayer, clearHighlightedLayer, showInactiveAdvisories, setSelectedRulesets, setAppliedAdvisoriesFilter, hideInactiveAdvisories } = rulesPluginActions;
    const { fetchClickedAdvisories, fetchAdvisories, fetchLocationName, fetchWeather, fetchRulesetInformation } = rulesPluginThunks;
    const mapStateToProps = state => ({
        classifiedLayersStyles: getClassifiedLayersStyles(state),
        unclassifiedLayersStyles: getUnclassifiedLayersStyles(state),
        mapJurisdictions: getMapJurisdictions(state),
        selectedAdvisory: getSelectedAdvisory(state),
        clickedAdvisories: getClickedAdvisories(state),
        isFetchingClickedAdvisories: getIsFetchingClickedAdvisories(state),
        mapBoundsGeometry: getMapBoundsGeometry(state),
        selectedRulesetsBySource: getSelectedRulesetsBySource(state),
        visibleRulesetsIds: getVisibleRulesetsIds(state),
        appliedAdvisoriesFilter: getAppliedAdvisoriesFilter(state),
        shouldShowInactiveAdvisories: getShouldShowInactiveAdvisories(state),
        highlightedLayer: getHighlightedLayer(state),
        locationName: getLocationName(state),
        locationWeather: getLocationWeather(state),
        mapBoundsGeometryCenter: getMapBoundsGeometryCenter(state),
        advisoriesData: getAdvisoriesData(state),
        advisoriesCounter: getAdvisoriesCounter(state),
        zoomLevel: getZoomLevel(state),
        jurisdictions: getMapJurisdictions(state),
        selectedRulesets: getSelectedRulesets(state),
        isMapPartiallyOverUnavailableJurisdiction: getIsMapPartiallyOverUnavailableJurisdiction(state),
        rulesetInformation: getParsedRulesetInformation(state),
        isFetchingRulesetInformation: getIsFetchingRulesetInformation(state)
    });
    const mapDispatchToProps = {
        setMapJurisdictions,
        clearSelectedAdvisory,
        setSelectedAdvisory,
        fetchClickedAdvisories,
        clearClickedAdvisories,
        fetchAdvisories,
        setMapBoundsGeometry,
        setClassifiedLayers,
        setIsMapPartiallyOverUnavailableJurisdiction,
        fetchLocationName,
        fetchWeather,
        setZoomLevel,
        setHighlightedLayer,
        clearHighlightedLayer,
        showInactiveAdvisories,
        setSelectedRulesets,
        fetchRulesetInformation,
        setAppliedAdvisoriesFilter,
        hideInactiveAdvisories
    };
    const RulesPluginContainer = connect(mapStateToProps, mapDispatchToProps)(RulesPlugin);
    return {
        rulesPluginStore,
        rulesPluginSelectors,
        rulesPluginActions,
        RulesPluginContainer
    };
}
