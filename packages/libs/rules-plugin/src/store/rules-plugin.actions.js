import * as types from './rules-plugin.types'

export function createRulesPluginActions(rulesPluginId) {
  const setClassifiedLayers = classifiedLayers => ({
    type: types.SET_CLASSIFIED_LAYERS,
    rulesPluginId,
    classifiedLayers
  })

  const setMapJurisdictions = mapJurisdictions => ({
    type: types.SET_MAP_JURISDICTIONS,
    rulesPluginId,
    mapJurisdictions
  })

  const setSelectedAdvisory = advisory => ({
    type: types.SET_SELECTED_ADVISORY,
    rulesPluginId,
    advisory
  })

  const clearSelectedAdvisory = () => ({
    type: types.CLEAR_SELECTED_ADVISORY,
    rulesPluginId
  })

  const setClickedAdvisories = advisories => ({
    type: types.SET_CLICKED_ADVISORIES,
    rulesPluginId,
    advisories
  })

  const clearClickedAdvisories = () => ({
    type: types.CLEAR_CLICKED_ADVISORIES,
    rulesPluginId
  })

  const setIsFetchingClickedAdvisories = () => ({
    type: types.SET_IS_FETCHING_CLICKED_ADVISORIES,
    rulesPluginId
  })

  const setClickedAdvisoriesFetched = () => ({
    type: types.SET_CLICKED_ADVISORIES_FETCHED,
    rulesPluginId
  })

  const setAdvisories = ({ parsedAdvisories, advisoriesCounter }) => ({
    type: types.SET_ADVISORIES,
    rulesPluginId,
    parsedAdvisories,
    advisoriesCounter
  })

  const clearAdvisories = () => ({
    type: types.CLEAR_ADVISORIES,
    rulesPluginId
  })

  const setMapBoundsGeometry = geometry => ({
    type: types.SET_MAP_BOUNDS_GEOMETRY,
    rulesPluginId,
    geometry
  })

  const setSelectedRulesets = rulesets => ({
    type: types.SET_SELECTED_RULESETS,
    rulesPluginId,
    rulesets
  })

  const setIsMapPartiallyOverUnavailableJurisdiction = status => ({
    type: types.SET_IS_MAP_PARTIALLY_OVER_UNAVAILABLE_JURISDICTION,
    rulesPluginId,
    status
  })

  const setRulesetInformation = rulesetInformation => ({
    type: types.SET_RULESET_INFORMATION,
    rulesPluginId,
    rulesetInformation
  })

  const setIsFetchingRulesetInformation = status => ({
    type: types.SET_IS_FETCHING_RULESET_INFORMATION,
    rulesPluginId,
    status
  })

  const setAppliedAdvisoriesFilter = value => ({
    type: types.SET_APPLIED_ADVISORIES_FILTER,
    rulesPluginId,
    value
  })

  const showInactiveAdvisories = () => ({
    type: types.SHOW_INACTIVE_ADVISORIES,
    rulesPluginId
  })

  const hideInactiveAdvisories = () => ({
    type: types.HIDE_INACTIVE_ADVISORIES,
    rulesPluginId
  })

  const setLocationName = locationName => ({
    type: types.SET_LOCATION_NAME,
    rulesPluginId,
    locationName
  })

  const setLocationWeather = locationWeather => ({
    type: types.SET_LOCATION_WEATHER,
    rulesPluginId,
    locationWeather
  })

  const setZoomLevel = zoomLevel => ({
    type: types.SET_ZOOM_LEVEL,
    rulesPluginId,
    zoomLevel
  })

  const setHighlightedLayer = layerId => ({
    type: types.SET_HIGHLIGHTED_LAYER,
    rulesPluginId,
    layerId
  })

  const clearHighlightedLayer = () => ({
    type: types.CLEAR_HIGHLIGHTED_LAYER,
    rulesPluginId
  })

  return {
    setClassifiedLayers,
    setMapJurisdictions,
    setSelectedAdvisory,
    clearSelectedAdvisory,
    setClickedAdvisories,
    clearClickedAdvisories,
    setIsFetchingClickedAdvisories,
    setClickedAdvisoriesFetched,
    setAdvisories,
    clearAdvisories,
    setMapBoundsGeometry,
    setSelectedRulesets,
    setIsMapPartiallyOverUnavailableJurisdiction,
    setRulesetInformation,
    setIsFetchingRulesetInformation,
    setAppliedAdvisoriesFilter,
    showInactiveAdvisories,
    hideInactiveAdvisories,
    setLocationName,
    setLocationWeather,
    setZoomLevel,
    setHighlightedLayer,
    clearHighlightedLayer
  }
}
