import * as types from './rules-plugin.types'
import {
  getCachedAppliedAdvisoriesFilter,
  getCachedShouldShowInactiveAdvisories
} from '../helpers/rules-plugin.helpers'

const initialState = {
  classifiedLayersStyles: [],
  mapJurisdictions: {},
  selectedAdvisory: '',
  clickedAdvisories: [],
  isFetchingClickedAdvisories: false,
  isMapPartiallyOverUnavailableJurisdiction: false,
  advisoriesData: {
    color: '',
    advisories: []
  },
  advisoriesCounter: 0,
  mapBoundsGeometry: {},
  selectedRulesets: {
    pick1: {},
    optional: {},
    highlighted: {}
  },
  isFetchingRulesetInformation: false,
  rulesetInformation: [],
  appliedAdvisoriesFilter: getCachedAppliedAdvisoriesFilter(),
  locationName: '',
  shouldShowInactiveAdvisories: getCachedShouldShowInactiveAdvisories(),
  locationWeather: {},
  zoomLevel: 0,
  highlightedLayer: ''
}

export function createRulesPluginStore(rulesPluginStoreSliceIds) {
  return function rulesPluginReducer(state = initialState, action) {
    const { rulesPluginId: actionRulesPluginId } = action
    if (rulesPluginStoreSliceIds != actionRulesPluginId) {
      return state
    }
    switch (action.type) {
      case types.SET_CLASSIFIED_LAYERS:
        return {
          ...state,
          classifiedLayersStyles: action.classifiedLayers
        }
      case types.SET_MAP_JURISDICTIONS:
        return {
          ...state,
          mapJurisdictions: action.mapJurisdictions
        }
      case types.SET_SELECTED_ADVISORY:
        return {
          ...state,
          selectedAdvisory: action.advisory
        }
      case types.CLEAR_SELECTED_ADVISORY:
        return {
          ...state,
          selectedAdvisory: ''
        }
      case types.SET_CLICKED_ADVISORIES:
        return {
          ...state,
          clickedAdvisories: action.advisories
        }
      case types.CLEAR_CLICKED_ADVISORIES:
        return {
          ...state,
          clickedAdvisories: []
        }
      case types.SET_IS_FETCHING_CLICKED_ADVISORIES:
        return {
          ...state,
          isFetchingClickedAdvisories: true
        }
      case types.SET_CLICKED_ADVISORIES_FETCHED:
        return {
          ...state,
          isFetchingClickedAdvisories: false
        }
      case types.SET_ADVISORIES:
        return {
          ...state,
          advisoriesData: action.parsedAdvisories,
          advisoriesCounter: action.advisoriesCounter
        }
      case types.CLEAR_ADVISORIES:
        return {
          ...state,
          advisoriesData: {},
          advisoriesCounter: 0
        }
      case types.SET_MAP_BOUNDS_GEOMETRY:
        return {
          ...state,
          mapBoundsGeometry: action.geometry
        }
      case types.SET_SELECTED_RULESETS:
        return {
          ...state,
          selectedRulesets: action.rulesets
        }
      case types.SET_IS_MAP_PARTIALLY_OVER_UNAVAILABLE_JURISDICTION:
        return {
          ...state,
          isMapPartiallyOverUnavailableJurisdiction: action.status
        }
      case types.SET_RULESET_INFORMATION:
        return {
          ...state,
          rulesetInformation: action.rulesetInformation
        }
      case types.SET_IS_FETCHING_RULESET_INFORMATION:
        return {
          ...state,
          isFetchingRulesetInformation: action.status
        }
      case types.SET_APPLIED_ADVISORIES_FILTER:
        return {
          ...state,
          appliedAdvisoriesFilter: { ...action.value }
        }
      case types.SHOW_INACTIVE_ADVISORIES:
        return {
          ...state,
          shouldShowInactiveAdvisories: true
        }
      case types.HIDE_INACTIVE_ADVISORIES:
        return {
          ...state,
          shouldShowInactiveAdvisories: false
        }
      case types.SET_LOCATION_NAME:
        return {
          ...state,
          locationName: action.locationName
        }
      case types.SET_LOCATION_WEATHER:
        return {
          ...state,
          locationWeather: action.locationWeather
        }
      case types.SET_ZOOM_LEVEL:
        return {
          ...state,
          zoomLevel: action.zoomLevel
        }
      case types.SET_HIGHLIGHTED_LAYER:
        return {
          ...state,
          highlightedLayer: action.layerId
        }
      case types.CLEAR_HIGHLIGHTED_LAYER:
        return {
          ...state,
          highlightedLayer: ''
        }
      default:
        return state
    }
  }
}
