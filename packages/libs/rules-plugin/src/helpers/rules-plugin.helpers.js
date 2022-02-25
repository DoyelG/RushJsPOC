import moment from 'moment'
import { point, buffer } from '@turf/turf'
import turfBbox from '@turf/bbox'
import turfBboxPolygon from '@turf/bbox-polygon'

import {
  apiKey,
  rulesetSourceUrl,
  rulesetClassifications,
  sourceTypes,
  layerTypes,
  layerColors,
  measurementUnits,
  geometryTypes,
  layerColorsOrder,
  rulesetSelectionTypes,
  layersIds,
  layerFilters,
  rulesetsStorageKey,
  temperatureUnits,
  appliedAdvisoriesFilterStorageKey,
  shouldShowInactiveAdvisoriesStorageKey,
  selectableRulesets,
  controlledAirspaceSubTypes
} from '../constants/rules-plugin.constants'

import { MeasurementTypes } from 'modules/core/constants/measurement-types.constants'

const {
  NON_CLASSIFIED,
  NON_GEO,
  HELIPORT,
  NOTICES_TO_AIRMEN,
  TEMPORARY_FLIGHT_RESTRICTIONS,
  BUILDINGS_3D,
  SPECIAL_USE_AIRSPACE,
  CONTROLLED_AIRSPACE
} = rulesetClassifications
const { VECTOR } = sourceTypes
const { HIGHLIGHTED } = layerColors
const { LINE, SYMBOL, JURISDICTIONS, AIRMAP, BACKGROUND, OVERLAY } = layerTypes
const { POINT } = geometryTypes
const { AIRMAP: AIRMAP_UNIT, SI, METERS } = measurementUnits
const { REQUIRED, OPTIONAL, PICK_ONE } = rulesetSelectionTypes
const { CLASSIFICATION_TYPES } = layerFilters

// FIXME: This function shouldn't be duplicated. It's already on map.helpers.
const getAirspaceMapFilter = layers => {
  let airspaceMapFilter = {}
  const hasLayers = layers && Boolean(layers.length) && Boolean(layers[0])

  if (hasLayers) {
    for (let type of layers) {
      const isControlledAirspaceType = type === CONTROLLED_AIRSPACE

      airspaceMapFilter = {
        ...airspaceMapFilter,
        [type]: !isControlledAirspaceType
          ? null
          : {
              [CLASSIFICATION_TYPES]: controlledAirspaceSubTypes.reduce(
                (classificationTypes, subType) => ({
                  ...classificationTypes,
                  [subType]: null
                }),
                {}
              )
            }
      }
    }
  }

  return airspaceMapFilter
}

export const getRulesetSource = ({
  ruleset,
  measurementUnits,
  tileServerAccessToken,
  appendQuery = '',
  appendFilter = null
}) => {
  const unit = measurementUnits === MeasurementTypes.METRIC ? SI : AIRMAP_UNIT

  const filter =
    (ruleset.layers && getAirspaceMapFilter(ruleset.layers)) ||
    appendFilter ||
    getAirspaceMapFilter(ruleset.airspace_types)

  const filterToAppend = Object.keys(filter).length ? `&filter=${encodeURI(JSON.stringify(filter))}` : ''

  const accessTokenToAppend = tileServerAccessToken ? `&access_token=${tileServerAccessToken}` : ''

  const tileSourceURL = `${rulesetSourceUrl}/${ruleset.id}/{z}/{x}/{y}?apikey=${apiKey}&units=${unit}${appendQuery}${accessTokenToAppend}${filterToAppend}`

  return {
    type: VECTOR,
    tiles: [tileSourceURL],
    minzoom: 6,
    maxzoom: 12
  }
}

const getTimeRangeFilter = ({ startTime, endTime, showInactive = true }) => {
  const start = moment(startTime).unix()
  const end = moment(endTime).unix()

  const expression = [
    'all',
    [
      'any',
      ['all', ['<=', 'start', end], ['>=', 'end', start]],
      ['all', ['>=', 'start', start], ['<=', 'end', end]],
      ['all', ['<=', 'start', end], ['!has', 'end']],
      ['all', ['!has', 'end'], ['!has', 'base']],
      ['==', 'permanent', true]
    ]
  ]

  if (!showInactive) {
    expression.push(['==', 'active', true])
  }

  return expression
}

export const setAppliedFilterToLayers = ({
  map,
  timeRange: { start: startTime, end: endTime },
  showInactiveAdvisories
}) => {
  const layers = map.getStyle().layers

  const filterExpression = getTimeRangeFilter({
    startTime,
    endTime,
    showInactive: showInactiveAdvisories
  })

  layers.forEach(layer => {
    const isAirmapLayer = layer.id.includes(AIRMAP)
    const isVisible = !layer.visibility || layer.visibility === 'visible'
    const isNoticesToAirmen = layer.id.includes(NOTICES_TO_AIRMEN)
    const isTemporaryFlightRestrictions = layer.id.includes(TEMPORARY_FLIGHT_RESTRICTIONS)
    const isSpecialUseAirspace = layer.id.includes(SPECIAL_USE_AIRSPACE)
    const hasClassificationTimeConstrains = isNoticesToAirmen || isTemporaryFlightRestrictions || isSpecialUseAirspace

    if (hasClassificationTimeConstrains && isAirmapLayer && isVisible) {
      map.setFilter(layer.id, filterExpression)
    }
  })
}

const addLayer = ({
  rulesetId,
  classification,
  layer: { beforeId, ...layer },
  map,
  filterTimeRange = {},
  showInactiveAdvisories,
  ruleset,
  injectLayerMetadata
}) => {
  const layerId = `${layer.id}|${rulesetId}`
  const layerExists = map.getLayer(layerId)

  const isNoticesToAirmen = classification === NOTICES_TO_AIRMEN
  const isTemporaryFlightRestrictions = classification === TEMPORARY_FLIGHT_RESTRICTIONS
  const isHeliport = classification === HELIPORT
  const isTypeSymbol = layer.type === SYMBOL
  const isSpecialUseAirspace = layer.id.includes(SPECIAL_USE_AIRSPACE)
  const hasClassificationTimeConstrains = isNoticesToAirmen || isTemporaryFlightRestrictions || isSpecialUseAirspace

  const metadataDynamicValues = injectLayerMetadata({ layer, classification, ruleset }) || {}

  if (!layerExists) {
    const layerToAdd = {
      ...layer,
      id: layerId,
      source: rulesetId,
      'source-layer': `${rulesetId}_${classification}`,
      metadata: {
        ...metadataDynamicValues
      }
    }

    if (hasClassificationTimeConstrains) {
      const start = filterTimeRange.start || moment()
      const end = filterTimeRange.end || moment().add(4, 'hours')
      layerToAdd.filter = getTimeRangeFilter({ startTime: start, endTime: end, showInactive: showInactiveAdvisories })
    }

    if (isHeliport && isTypeSymbol) {
      layerToAdd.minzoom = 11
    }

    // FIMXE: this happens because the style is arriving late, is not a final fix, but fix the issue temporally
    map.addLayer(layerToAdd, 'waterway-label' || beforeId)
  }
}

const addHighlightLayers = ({ map, rulesetId, classification, beforeID }) => {
  map.addLayer(
    {
      id: `${classification}|${rulesetId}|highlight`,
      type: LINE,
      source: rulesetId,
      'source-layer': `${rulesetId}_${classification}`,
      paint: {
        'line-color': HIGHLIGHTED,
        'line-width': 5
      },
      filter: ['in', 'id', '']
    },
    beforeID
  )
}

const getBeforeIds = layers => {
  const lastAirmapOverlayLayerIndex = layers.findIndex((layer, index) => {
    const nextLayer = layers[index + 1]
    const isAirmapLayer = layer.id.includes(AIRMAP)
    const isNextAirmapLayer = nextLayer && nextLayer.id.includes(AIRMAP)

    const isAirmapOverlayLayer = isAirmapLayer && layer.id.includes(OVERLAY) && layer.type !== SYMBOL
    const nextIsAirmapOverlayLayer = isNextAirmapLayer && nextLayer.id.includes(OVERLAY) && nextLayer.type !== SYMBOL

    const isLastAirmapOverlayLayer = isAirmapOverlayLayer && !nextIsAirmapOverlayLayer

    return isLastAirmapOverlayLayer
  })

  const lastAirmapSymbolLayerIndex = layers.findIndex((layer, index) => {
    const nextLayer = layers[index + 1]
    const isAirmapLayer = layer.id.includes(AIRMAP)
    const isNextAirmapLayer = nextLayer && nextLayer.id.includes(AIRMAP)

    const isAirmapSymbolLayer = isAirmapLayer && layer.type === SYMBOL
    const nextIsAirmapSymbolLayer = isNextAirmapLayer && nextLayer.type === SYMBOL

    const isLastAirmapSymbolLayer = isAirmapSymbolLayer && !nextIsAirmapSymbolLayer

    return isLastAirmapSymbolLayer
  })

  const overlayBeforeId = layers[lastAirmapOverlayLayerIndex + 1] && layers[lastAirmapOverlayLayerIndex + 1].id
  const symbolBeforeId = layers[lastAirmapSymbolLayerIndex + 1]
    ? layers[lastAirmapSymbolLayerIndex + 1].id
    : layers[lastAirmapSymbolLayerIndex].id

  return [overlayBeforeId, symbolBeforeId]
}

const addRuleset = ({
  ruleset,
  map,
  measurementUnits,
  classifiedLayersStyles,
  unclassifiedLayersStyles,
  filterTimeRange = {},
  showInactiveAdvisories = true,
  tileServerAccessToken,
  injectLayerMetadata
}) => {
  const rulesetId = ruleset.id
  const rulesetSourceExists = rulesetId && map.getSource(rulesetId)
  const rulesetsLayers = ruleset.layers || ruleset.airspace_types

  if (rulesetsLayers.length && !rulesetSourceExists) {
    map.addSource(
      rulesetId,
      getRulesetSource({
        ruleset,
        measurementUnits,
        tileServerAccessToken,
        appendQuery: ruleset.appendQuery || '',
        appendFilter: ruleset.appendFilter || null
      })
    )

    rulesetsLayers.forEach(classification => {
      if (classification !== NON_GEO) {
        const baseLayers = classifiedLayersStyles.filter(layer => layer.id.includes(`|${classification}|`))

        const layersToAdd = baseLayers.length
          ? baseLayers
          : unclassifiedLayersStyles.map(layer => ({
              ...layer,
              id: layer.id.replace(NON_CLASSIFIED, classification)
            }))

        layersToAdd.forEach(layer => {
          addLayer({
            rulesetId,
            classification,
            layer,
            map,
            filterTimeRange,
            showInactiveAdvisories,
            ruleset,
            injectLayerMetadata
          })
        })

        const beforeID = layersToAdd.length && layersToAdd[0].beforeId

        if (beforeID) {
          addHighlightLayers({ map, rulesetId, classification, beforeID })
        }
      }
    })
  }
}

export const removeRuleset = ({ ruleset, map, condition = true }) => {
  const rulesetSource = map.getSource(ruleset.id)

  if (rulesetSource && condition) {
    const mapLayers = map.getStyle().layers

    mapLayers.forEach(layer => {
      const isLayerFromOldRuleset = layer.source === ruleset.id

      if (isLayerFromOldRuleset) {
        map.removeLayer(layer.id)
      }
    })

    map.removeSource(ruleset.id)
  }
}

export const sortAdvisories = ({ advisories, advisoryId }) => {
  const sortedAdvisories = advisories.sort((a, b) => {
    if (a.id === advisoryId) {
      return -1
    }
    if (a.id < b.id) {
      return -1
    } else if (b.id < a.id) {
      return 1
    }
    return 0
  })

  return sortedAdvisories
}

export const moveToSelectedLayer = ({ map, advisoryId, longitude, latitude }) => {
  const features = map
    .queryRenderedFeatures()
    .filter(
      feature =>
        feature.layer.id.indexOf(AIRMAP) > -1 &&
        feature.properties.id &&
        feature.properties.id === advisoryId &&
        feature.geometry
    )

  if (features.length) {
    const bbox = turfBbox({
      type: 'FeatureCollection',
      features: features
    })
    map.fitBounds(bbox, { padding: 100, maxZoom: 12.5 })
  } else if (longitude && latitude) {
    const bbox = turfBbox({
      type: 'Feature',
      geometry: {
        type: POINT,
        coordinates: [longitude, latitude]
      }
    })
    map.fitBounds(bbox, { maxZoom: 12.5 })
  }
}

export const getClickedGeometry = lngLat => {
  const turfPoint = point([lngLat.lng, lngLat.lat])
  return buffer(turfPoint, 1, { units: METERS })
}

export const classifyLayers = layers => {
  const [overlayBeforeId, symbolBeforeId] = getBeforeIds(layers)

  const classifiedLayers = layers.reduce((classifiedLayers, layer) => {
    const layerId = layer.id
    const isAirmapLayer = layerId && layerId.includes(AIRMAP)
    const isNotBackgroundLayer = !layerId.includes(BACKGROUND)

    if (isAirmapLayer && isNotBackgroundLayer) {
      const isOverlayLayer = layer.id.includes(OVERLAY) && layer.type !== SYMBOL
      const isSymbolLayer = layer.type === SYMBOL

      if (isOverlayLayer) {
        layer.beforeId = overlayBeforeId
      } else if (isSymbolLayer) {
        layer.beforeId = symbolBeforeId
      }

      classifiedLayers = [...classifiedLayers, layer]
    }

    return classifiedLayers
  }, [])

  return classifiedLayers
}

export const getJurisdictionsFromMap = (map, availableDynamicJurisdictions, availableJurisdictionUUIDs) => {
  const hasDefaultJurisdiction = Boolean(availableJurisdictionUUIDs.length)
  const features = map.queryRenderedFeatures()

  const jurisdictions = features.reduce(
    function getValidParsedJurisdiction(parsedJurisdictions, feature) {
      try {
        const isJurisdictionSource = feature.layer.source === JURISDICTIONS
        const hasJurisdictionProperties = feature.properties.jurisdiction
        const is3DLayer = feature.layer.id === BUILDINGS_3D

        if (isJurisdictionSource && hasJurisdictionProperties && !is3DLayer) {
          const jurisdiction = JSON.parse(feature.properties.jurisdiction)
          const uuid = jurisdiction.uuid
          const isValidJurisdiction = jurisdiction.rulesets.length && !parsedJurisdictions[uuid]
          const hasDynamicJurisdictions = Boolean(availableDynamicJurisdictions.length)

          const isAvailable = hasDefaultJurisdiction
            ? availableJurisdictionUUIDs.includes(uuid)
            : hasDynamicJurisdictions
            ? availableDynamicJurisdictions.includes(uuid)
            : true

          if (isValidJurisdiction) {
            if (isAvailable) {
              parsedJurisdictions.availableJurisdictions[uuid] = jurisdiction
            } else {
              parsedJurisdictions.unavailableJurisdictions = [
                ...parsedJurisdictions.unavailableJurisdictions,
                jurisdiction
              ]
            }
          }
        }
      } catch (error) {
        console.warn(error)
      }

      return parsedJurisdictions
    },
    { availableJurisdictions: {}, unavailableJurisdictions: [] }
  )

  return jurisdictions
}

const getIsRulesetVisible = ({ selectedRulesetsBySource, ruleset, rulesetsAlwaysVisible }) => {
  const selectedRuleset = selectedRulesetsBySource[ruleset.id]
  const isDefault = Boolean(ruleset.default)
  const isRequired = ruleset.selection_type === REQUIRED
  const visibility = selectedRuleset ? selectedRuleset.visibility : isDefault || isRequired ? 'visible' : 'none'

  const isAlwaysVisible = rulesetsAlwaysVisible.some(({ id }) => id === ruleset.id)

  return isAlwaysVisible || visibility === 'visible'
}

export const updateRulesetLayersMap = ({
  map,
  measurementUnits,
  currentMeasurementUnits,
  classifiedLayersStyles,
  unclassifiedLayersStyles,
  incomingMapJurisdictions,
  mapJurisdictions,
  filterTimeRange,
  showInactiveAdvisories,
  selectedRulesetsBySource,
  injectedRulesets,
  allowDynamicRulesets,
  tileServerAccessToken,
  onRulesetsUpdate,
  injectLayerMetadata
}) => {
  const hasMeasurementUnitChanged = currentMeasurementUnits !== measurementUnits
  if (!allowDynamicRulesets) {
    return (
      Boolean(injectedRulesets.length) &&
      injectedRulesets.forEach(ruleset => {
        removeRuleset({ ruleset, map, condition: hasMeasurementUnitChanged })

        addRuleset({
          ruleset,
          map,
          measurementUnits,
          classifiedLayersStyles,
          unclassifiedLayersStyles,
          filterTimeRange,
          showInactiveAdvisories,
          tileServerAccessToken,
          injectLayerMetadata
        })
        onRulesetsUpdate({ ruleset, map, measurementUnits })
      })
    )
  }

  for (const incomingMapJurisdiction in incomingMapJurisdictions) {
    incomingMapJurisdictions[incomingMapJurisdiction].rulesets.forEach(ruleset => {
      const isVisible = getIsRulesetVisible({
        selectedRulesetsBySource,
        ruleset,
        rulesetsAlwaysVisible: injectedRulesets
      })

      removeRuleset({ ruleset, map, condition: hasMeasurementUnitChanged })

      if (isVisible) {
        addRuleset({
          ruleset,
          map,
          measurementUnits,
          classifiedLayersStyles,
          unclassifiedLayersStyles,
          filterTimeRange,
          showInactiveAdvisories,
          tileServerAccessToken,
          injectLayerMetadata
        })
        onRulesetsUpdate({ ruleset, map, measurementUnits })
      } else {
        removeRuleset({ ruleset, map })
      }
    })
  }

  for (const mapJurisdiction in mapJurisdictions) {
    const isOldJurisdictionToRemove = !incomingMapJurisdictions[mapJurisdiction]

    if (isOldJurisdictionToRemove) {
      mapJurisdictions[mapJurisdiction].rulesets.forEach(ruleset => removeRuleset({ ruleset, map }))
    }
  }
}

export const getDeviceTimeZone = () => {
  const timezone = moment.tz.zone(moment.tz.guess())
  const customDateFromDevice = new Date()
  const deviceTimeZoneOffset = customDateFromDevice.getTimezoneOffset()
  const deviceTimezoneAbbr = timezone.abbr(deviceTimeZoneOffset)
  return deviceTimezoneAbbr
}

export const getUrlWithHTTP = url => {
  if (!/^(f|ht)tps?:\/\//i.test(url)) {
    url = 'http://' + url
  }
  return url
}

export const getMapBoundsBbox = bounds => {
  const { lng: southWestLongitude, lat: southWestLatitude } = bounds.getSouthWest().wrap()
  const { lng: northEastLongitude, lat: northEastLatitude } = bounds.getNorthEast().wrap()
  return turfBboxPolygon([southWestLongitude, southWestLatitude, northEastLongitude, northEastLatitude])
}

export const parseAdvisoriesByType = advisories => {
  const sortedAdvisoriesByColor = advisories.sort((a, b) => {
    const result = layerColorsOrder[a.color] - layerColorsOrder[b.color]

    if (result < 0) {
      return -1
    } else if (result > 0) {
      return 1
    }

    return a.type.localeCompare(b.type)
  })

  const groupedAdvisories = sortedAdvisoriesByColor.reduce((groupedAdvisories, advisory) => {
    let colorCategory = groupedAdvisories.find(parsedAdvisory => parsedAdvisory.color === advisory.color)

    if (!colorCategory) {
      colorCategory = {
        color: advisory.color,
        categories: []
      }

      groupedAdvisories.push(colorCategory)
    }

    let colorCategoryType = colorCategory.categories.find(categories => categories.type === advisory.type)

    if (!colorCategoryType) {
      colorCategoryType = {
        type: advisory.type,
        advisories: []
      }

      colorCategory.categories.push(colorCategoryType)
    }

    colorCategoryType.advisories.push(advisory)

    return groupedAdvisories
  }, [])

  const parsedAdvisories = groupedAdvisories.map(advisoriesGroup => {
    const sortedAdvisoriesByCategory = advisoriesGroup.categories.sort((a, b) => {
      return a.advisories.length - b.advisories.length
    })

    return { ...advisoriesGroup, categories: sortedAdvisoriesByCategory }
  })

  return parsedAdvisories
}

export const groupRulesets = rulesets => {
  const groupedRulesets = rulesets.reduce(
    (groupedRulesets, ruleset) => {
      const isPickOne = ruleset.selection_type === PICK_ONE
      const isRequired = ruleset.selection_type === REQUIRED
      const isOptional = ruleset.selection_type === OPTIONAL

      if (isPickOne) {
        return { ...groupedRulesets, [PICK_ONE]: [...groupedRulesets[PICK_ONE], ruleset] }
      }
      if (isRequired) {
        return { ...groupedRulesets, [REQUIRED]: [...groupedRulesets[REQUIRED], ruleset] }
      }
      if (isOptional) {
        return { ...groupedRulesets, [OPTIONAL]: [...groupedRulesets[OPTIONAL], ruleset] }
      }
      return groupedRulesets
    },
    { [PICK_ONE]: [], [OPTIONAL]: [], [REQUIRED]: [] }
  )

  return groupedRulesets
}

export const getDefaultSelectedRulesets = (jurisdictions, selectedRulesets) => {
  const selectedPickOneRulesets = { ...selectedRulesets[PICK_ONE] }
  const selectedOptionalRulesets = { ...selectedRulesets[OPTIONAL] }

  for (const jurisdiction in jurisdictions) {
    const rulesets = jurisdictions[jurisdiction].rulesets
    const jurisdictionUUID = jurisdictions[jurisdiction].uuid
    const groupedRulesets = groupRulesets(rulesets)

    const pickOneRulesets = groupedRulesets[PICK_ONE]
    const pickOneRulesetSelected = pickOneRulesets.find(
      ({ id }) => selectedRulesets[PICK_ONE][id] && selectedRulesets[PICK_ONE][id].visibility === 'visible'
    )

    let defaultPickOneRulesetId = ''

    if (!pickOneRulesetSelected) {
      const defaultPickOneRuleset = pickOneRulesets.find(ruleset => ruleset.default)
      defaultPickOneRulesetId = defaultPickOneRuleset
        ? defaultPickOneRuleset.id
        : pickOneRulesets[0]
        ? pickOneRulesets[0].id
        : ''
    } else {
      defaultPickOneRulesetId = pickOneRulesetSelected.id
    }

    if (defaultPickOneRulesetId) {
      selectedPickOneRulesets[defaultPickOneRulesetId] = {
        visibility: 'visible',
        jurisdictionUUID
      }
    }

    const optionalRulesets = groupedRulesets[OPTIONAL]
    const defaultOptionalRulesets = optionalRulesets.filter(ruleset => ruleset.default)
    const defaultOptionalRulesetsIds = defaultOptionalRulesets

    defaultOptionalRulesetsIds.forEach(({ id }) => {
      const optionalRulesetSelected = selectedRulesets[OPTIONAL][id] && selectedRulesets[OPTIONAL][id].visibility
      selectedOptionalRulesets[id] = {
        visibility: optionalRulesetSelected || 'visible',
        jurisdictionUUID
      }
    })
  }

  return {
    [PICK_ONE]: selectedPickOneRulesets,
    [OPTIONAL]: selectedOptionalRulesets
  }
}

export const updateSourceTileURL = ({ mapInstance, sourceId, tileSourceURL }) => {
  mapInstance.getSource(sourceId).tiles = [tileSourceURL]
  mapInstance.style.sourceCaches[sourceId].clearTiles()
  mapInstance.style.sourceCaches[sourceId].update(mapInstance.transform)
  mapInstance.triggerRepaint()
}

export const createRestrictedZoneDelimiters = ({ map, availableJurisdictionUUIDs }) => {
  const filterUnavailableAreas = availableJurisdictionUUIDs
    ? availableJurisdictionUUIDs.map(uuid => ['!', ['in', uuid, ['get', 'jurisdiction']]])
    : []
  const filterAvailableAreas = availableJurisdictionUUIDs
    ? availableJurisdictionUUIDs.map(uuid => ['in', uuid, ['get', 'jurisdiction']])
    : []
  const sourceLayer = {
    source: 'jurisdictions',
    'source-layer': 'jurisdictions'
  }

  if (!map.getLayer(layersIds.UNSUPPORTED_JURISDICTIONS_FILL)) {
    const background = map.getLayer(layersIds.BACKGROUND)
    map.addLayer({
      id: layersIds.UNSUPPORTED_JURISDICTIONS_FILL,
      ...sourceLayer,
      type: 'fill',
      paint: {
        'fill-color': background.paint['_values']['background-color'].toString(),
        'fill-opacity': 0.6
      },
      filter: ['any', ...filterUnavailableAreas]
    })
  }

  if (!map.getLayer(layersIds.UNSUPPORTED_JURISDICTIONS_SYMBOL)) {
    map.addLayer({
      id: layersIds.UNSUPPORTED_JURISDICTIONS_SYMBOL,
      ...sourceLayer,
      type: 'fill',
      paint: {
        'fill-pattern': 'heliports_lines_pattern',
        'fill-opacity': 0.8
      },
      filter: ['any', ...filterUnavailableAreas]
    })
  }

  if (!map.getLayer(layersIds.SUPPORTED_JURISDICTIONS_LINE)) {
    map.addLayer({
      id: layersIds.SUPPORTED_JURISDICTIONS_LINE,
      ...sourceLayer,
      type: 'line',
      paint: {
        'line-color': '#333F48',
        'line-width': 2.0
      },
      filter: ['any', ...filterAvailableAreas]
    })
  }
}

export const getCachedSelectedRulesets = () => {
  const storageSelectedRulesets = sessionStorage.getItem(rulesetsStorageKey)

  let defaultSelectedRulesets = {
    pick1: {},
    optional: {}
  }

  try {
    const parsedStorageSelectedRulesets = JSON.parse(storageSelectedRulesets) || {}

    defaultSelectedRulesets = {
      ...defaultSelectedRulesets,
      ...parsedStorageSelectedRulesets
    }
  } catch (error) {
    console.warn(error)
  }

  return defaultSelectedRulesets
}

export const getCachedAppliedAdvisoriesFilter = () => {
  const storageAppliedAdvisoriesFilter = localStorage.getItem(appliedAdvisoriesFilterStorageKey)

  let defaultAppliedAdvisoriesFilter = {
    formattedValue: '',
    start: '',
    end: ''
  }

  try {
    const parsedStorageAppliedAdvisoriesFilter = JSON.parse(storageAppliedAdvisoriesFilter) || {}

    defaultAppliedAdvisoriesFilter = {
      ...defaultAppliedAdvisoriesFilter,
      ...parsedStorageAppliedAdvisoriesFilter
    }
  } catch (error) {
    console.warn(error)
  }

  return defaultAppliedAdvisoriesFilter
}

export const getCachedShouldShowInactiveAdvisories = () => {
  const storageAppliedAdvisoriesFilter = localStorage.getItem(shouldShowInactiveAdvisoriesStorageKey)

  let defaultAppliedAdvisoriesFilter = true

  try {
    const value = JSON.parse(storageAppliedAdvisoriesFilter)

    if (typeof value === 'boolean') {
      defaultAppliedAdvisoriesFilter = value
    }
  } catch (error) {
    console.warn(error)
  }

  return defaultAppliedAdvisoriesFilter
}

export const getTemperatureString = (units, temperature) => {
  const isImperial = units === MeasurementTypes.IMPERIAL
  const parsedTemperature = isImperial ? Math.round(temperature * 1.8 + 32) : temperature

  if (isImperial) {
    return parsedTemperature.toFixed(0) + temperatureUnits.FAHRENHEIT
  } else {
    return parsedTemperature.toFixed(0) + temperatureUnits.CELSIUS
  }
}

export const getSelectableRulesets = selectedRulesets => {
  return Object.keys(selectedRulesets).reduce((rulesets, selectedRulesetsGroupId) => {
    const isSelectable = selectableRulesets.includes(selectedRulesetsGroupId)
    const ruleset = selectedRulesets[selectedRulesetsGroupId]

    return isSelectable ? { ...rulesets, [selectedRulesetsGroupId]: ruleset } : rulesets
  }, {})
}
