import React, { useEffect, useCallback, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import styles, {
  rulesPluginContainer,
  rulesPluginHeader,
  advisoriesRulesetsMenuWrapper
} from './RulesPlugin.styles.scss'

import {
  updateRulesetLayersMap,
  getJurisdictionsFromMap,
  moveToSelectedLayer,
  getMapBoundsBbox,
  classifyLayers,
  updateSourceTileURL,
  createRestrictedZoneDelimiters,
  setAppliedFilterToLayers,
  removeRuleset
} from './helpers/rules-plugin.helpers'
import { getGeometryCenter } from './helpers/mapboxgl.helpers'
import {
  jurisdictionLayer,
  layerTypes,
  zoomLevels,
  jurisdictionBaseTileSourceURL
} from './constants/rules-plugin.constants'
import { SelectedAdvisoriesList } from './components/SelectedAdvisoriesList/SelectedAdvisoriesList.component'
import { AdvisoriesHeader } from './components/AdvisoriesHeader/AdvisoriesHeader.component'
import { RulesetsMenu } from './components/RulesetsMenu/RulesetsMenu.component'
import { AdvisoriesFilter } from './components/AdvisoriesFilter/AdvisoriesFilter.component'
import { LocationInformation } from './components/LocationInformation/LocationInformation.component'
import { useMemoiseCalls } from './hooks/useMemoiseCalls.hook'
import { airmapAuth } from 'libs/airmap-auth'
import { handleSignIn } from 'projects/web-app/utilities/helpers'
import { RulesetsToggle } from './components/RulesetsToggle/RulesetsToggle.component'

import settings from 'settings'
import { debounce } from 'modules/core/helpers/utilities.helpers'

const {
  AirMapAuth,
  auth: { token: localStorageTokenKey }
} = settings

const { AIRMAP } = layerTypes

const { ADVISORIES_ZOOM_REQUIRED } = zoomLevels

export const RulesPlugin = ({
  map,
  measurementUnits,
  setClassifiedLayers,
  classifiedLayersStyles,
  unclassifiedLayersStyles,
  mapJurisdictions,
  setMapJurisdictions,
  selectedAdvisory,
  setSelectedAdvisory,
  clearSelectedAdvisory,
  fetchClickedAdvisories,
  clickedAdvisories,
  isFetchingClickedAdvisories,
  clearClickedAdvisories,
  fetchAdvisories,
  mapBoundsGeometry,
  setMapBoundsGeometry,
  selectedRulesetsBySource,
  visibleRulesetsIds,
  setIsMapPartiallyOverUnavailableJurisdiction,
  appliedAdvisoriesFilter,
  shouldShowInactiveAdvisories,
  fetchLocationName,
  fetchWeather,
  setZoomLevel,
  setHighlightedLayer,
  highlightedLayer,
  clearHighlightedLayer,
  showLocationInformation,
  showAdvisoriesFilter,
  showAdvisoriesList,
  showRulesetsMenu,
  showClickedAdvisoriesBox,
  showInactiveAdvisories,
  mapBoundsGeometryCenter,
  locationName,
  locationWeather,
  advisoriesData,
  advisoriesCounter,
  zoomLevel,
  jurisdictions,
  selectedRulesets,
  setSelectedRulesets,
  isMapPartiallyOverUnavailableJurisdiction,
  fetchRulesetInformation,
  rulesetInformation,
  isFetchingRulesetInformation,
  setAppliedAdvisoriesFilter,
  hideInactiveAdvisories,
  injectedSelectedRulesets,
  menusSettings,
  selectedAdvisorySettings,
  injectedRulesets,
  allowDynamicRulesets,
  tileServerAccessToken,
  shouldIncludeAccessTokenInTileService,
  onRulesetsUpdate,
  injectLayerMetadata,
  availableDynamicJurisdictionsUUIDs,
  whiteLabelAvailableJurisdictionUUIDs,
  allowFetchAdvisoriesData,
  rulesetsMenuPortalModeEnabled,
  rulesetsMenuPortalInlineStyles,
  selectedAdvisoryHasSmallSize,
  showToggleInjectedRulesetsVisibility,
  useSmallRulesetsMenuStyles
}) => {
  const [isJurisdictionSourceLoaded, setIsJurisdictionSourceLoaded] = useState(false)
  const [areInjectedRulesetsHidden, setAreInjectedRulesetsHidden] = useState(false)
  const [currentMeasurementUnits, setCurrentMeasurementUnits] = useState(measurementUnits)

  const { position, isolated } = menusSettings
  const filteredTileServerAccessToken = shouldIncludeAccessTokenInTileService ? tileServerAccessToken : ''

  const handleMapUpdates = useCallback(() => {
    const { availableJurisdictions: incomingMapJurisdictions, unavailableJurisdictions } = getJurisdictionsFromMap(
      map,
      availableDynamicJurisdictionsUUIDs,
      whiteLabelAvailableJurisdictionUUIDs
    )

    updateRulesetLayersMap({
      map,
      measurementUnits,
      currentMeasurementUnits,
      classifiedLayersStyles,
      unclassifiedLayersStyles,
      incomingMapJurisdictions,
      mapJurisdictions,
      filterTimeRange: { ...appliedAdvisoriesFilter },
      showInactiveAdvisories: shouldShowInactiveAdvisories,
      selectedRulesetsBySource,
      injectedRulesets,
      allowDynamicRulesets,
      tileServerAccessToken: filteredTileServerAccessToken,
      onRulesetsUpdate,
      injectLayerMetadata
    })

    setMapJurisdictions(incomingMapJurisdictions)
    debounce(handleMapBoundsUpdates, 1500)()

    const hasDefaultJurisdiction = Boolean(whiteLabelAvailableJurisdictionUUIDs.length)
    const hasIncomingMapJurisdictions =
      incomingMapJurisdictions && Boolean(Object.keys(incomingMapJurisdictions).length)

    if (hasDefaultJurisdiction || hasIncomingMapJurisdictions) {
      const hasUnavailableJurisdictions = Boolean(unavailableJurisdictions.length)

      createRestrictedZoneDelimiters({ map, availableJurisdictionUUIDs: whiteLabelAvailableJurisdictionUUIDs })
      setIsMapPartiallyOverUnavailableJurisdiction(hasUnavailableJurisdictions)
    }
  }, [
    map,
    availableDynamicJurisdictionsUUIDs,
    whiteLabelAvailableJurisdictionUUIDs,
    measurementUnits,
    currentMeasurementUnits,
    classifiedLayersStyles,
    unclassifiedLayersStyles,
    mapJurisdictions,
    appliedAdvisoriesFilter,
    shouldShowInactiveAdvisories,
    selectedRulesetsBySource,
    injectedRulesets,
    allowDynamicRulesets,
    filteredTileServerAccessToken,
    onRulesetsUpdate,
    injectLayerMetadata,
    setMapJurisdictions,
    handleMapBoundsUpdates,
    setIsMapPartiallyOverUnavailableJurisdiction
  ])

  useEffect(() => {
    if (measurementUnits !== currentMeasurementUnits) {
      handleMapUpdates()
      setCurrentMeasurementUnits(measurementUnits)
    }
  }, [currentMeasurementUnits, handleMapUpdates, measurementUnits])

  const handleMissingInjectedRulesets = useCallback(() => {
    if (!injectedRulesets.length && isJurisdictionSourceLoaded) {
      handleMapUpdates()
    }
  }, [handleMapUpdates, injectedRulesets.length, isJurisdictionSourceLoaded])

  const missingInjectedRulesetParams = useMemo(
    () => ({
      selectedRulesetsBySource,
      isJurisdictionSourceLoaded
    }),
    [isJurisdictionSourceLoaded, selectedRulesetsBySource]
  )

  useMemoiseCalls(handleMissingInjectedRulesets, missingInjectedRulesetParams)

  const handleMapBoundsUpdates = useCallback(() => {
    const { geometry: bboxGeometry } = getMapBoundsBbox(map.getBounds())
    const zoomLevel = map.getZoom()

    setMapBoundsGeometry(bboxGeometry)
    setZoomLevel(zoomLevel)
  }, [map, setMapBoundsGeometry, setZoomLevel])

  const handleMapMovement = useCallback(() => {
    handleMapBoundsUpdates()
    handleMapUpdates()
  }, [handleMapUpdates, handleMapBoundsUpdates])

  const hideHighlightedLayer = useCallback(() => {
    const isLayerOnMap = map.getLayer(highlightedLayer)

    if (isLayerOnMap) {
      map.setFilter(highlightedLayer, ['in', 'id', ''])
    } else {
      clearHighlightedLayer()
      clearSelectedAdvisory()
    }
  }, [map, highlightedLayer, clearHighlightedLayer, clearSelectedAdvisory])

  const handleSelectAdvisory = useCallback(
    advisory => {
      hideHighlightedLayer()

      const { id: advisoryId, ruleset_id, type, latitude, longitude } = advisory

      moveToSelectedLayer({ map, advisoryId, longitude, latitude })

      const highlightedLayer = `${type}|${ruleset_id}|highlight`
      map.setFilter(highlightedLayer, ['in', 'id', advisoryId])

      setSelectedAdvisory(advisoryId)
      setHighlightedLayer(highlightedLayer)
    },
    [hideHighlightedLayer, map, setHighlightedLayer, setSelectedAdvisory]
  )

  const handleClearClickedAdvisories = useCallback(() => {
    hideHighlightedLayer()
    clearSelectedAdvisory()
    clearClickedAdvisories()
  }, [clearClickedAdvisories, clearSelectedAdvisory, hideHighlightedLayer])

  const handleMapClicks = useCallback(
    ({ target: map, point, lngLat }) => {
      if (selectedAdvisory) {
        hideHighlightedLayer()
      }

      const features = map.queryRenderedFeatures(point)

      const rulesetsIds = visibleRulesetsIds

      const clickedAdvisory = features.find(
        feature =>
          feature.layer.id.includes(AIRMAP) && feature.properties.id && feature.properties.category !== 'notification'
      )

      if (clickedAdvisory) {
        const {
          properties: { category: classification, ruleset_id, id: advisoryId }
        } = clickedAdvisory
        const isValidAdvisory = classification && ruleset_id && advisoryId

        if (isValidAdvisory) {
          const highlightedLayer = `${classification}|${ruleset_id}|highlight`

          map.setFilter(highlightedLayer, ['in', 'id', advisoryId])
          fetchClickedAdvisories({ lngLat, advisoryId, rulesetsIds })

          setSelectedAdvisory(advisoryId)
          setHighlightedLayer(highlightedLayer)
        }
      } else {
        handleClearClickedAdvisories()
      }
    },
    [
      selectedAdvisory,
      hideHighlightedLayer,
      fetchClickedAdvisories,
      visibleRulesetsIds,
      setSelectedAdvisory,
      setHighlightedLayer,
      handleClearClickedAdvisories
    ]
  )

  const updateMapLayersOnSourceDataLoaded = useCallback(
    data => {
      // TODO: check why draw plugin dispatches so many times this event
      const isDrawPluginEvent = data.sourceId && data.sourceId.includes('mapbox-gl-draw')
      if (data.isSourceLoaded && !isDrawPluginEvent) {
        setIsJurisdictionSourceLoaded(true)
        handleMapUpdates()
      }
    },
    [handleMapUpdates]
  )

  const applyFilterToLayers = useCallback(
    ({ timeRange = appliedAdvisoriesFilter, showInactiveAdvisories = false }) => {
      setAppliedFilterToLayers({
        map,
        timeRange,
        showInactiveAdvisories
      })
    },
    [appliedAdvisoriesFilter, map]
  )

  const getAdvisoriesFromVisibleRulesets = useCallback(
    debounce(() => {
      const zoomLevel = map.getZoom()
      if (
        visibleRulesetsIds &&
        zoomLevel >= ADVISORIES_ZOOM_REQUIRED &&
        (showAdvisoriesFilter || showAdvisoriesList || allowFetchAdvisoriesData)
      ) {
        fetchAdvisories({ mapBoundsGeometry, rulesetsIds: visibleRulesetsIds })
      }
    }, 1500),
    [fetchAdvisories, mapBoundsGeometry, visibleRulesetsIds, map, showAdvisoriesFilter, showAdvisoriesList]
  )

  const handleMapErrors = useCallback(errorEvent => {
    const isUnauthenticatedError = errorEvent.error.status === 401
    const isForbiddenError = errorEvent.error.status === 403

    if (isUnauthenticatedError || isForbiddenError) {
      if (airmapAuth.isEnabled) {
        return airmapAuth.login()
      } else {
        return handleSignIn(`${window.location.pathname}${window.location.search}`)
      }
    }
  }, [])

  useMemoiseCalls(getAdvisoriesFromVisibleRulesets, {
    mapBoundsGeometry,
    rulesetsIds: visibleRulesetsIds
  })

  useEffect(
    function getClassifiedLayers() {
      const classifiedLayers = classifyLayers(map.getStyle().layers)
      setClassifiedLayers(classifiedLayers)
    },
    [map, setClassifiedLayers]
  )

  useEffect(
    function setUpJurisdictionBackgroundLayer() {
      if (allowDynamicRulesets) {
        const jurisdictionLayerId = jurisdictionLayer.id
        const mapJurisdictionSource = map.getSource(jurisdictionLayerId)
        const hasJurisdictionTileSourceURL =
          mapJurisdictionSource &&
          mapJurisdictionSource.tiles &&
          mapJurisdictionSource.tiles[0].includes(jurisdictionBaseTileSourceURL)

        if (classifiedLayersStyles.length && !hasJurisdictionTileSourceURL) {
          const mapJurisdictionLayer = map.getLayer(jurisdictionLayerId)

          if (!mapJurisdictionLayer) {
            map.addLayer(jurisdictionLayer, 'background')
          }

          // FIXME: We have two different instances of airmap auth we need to find a way to unify o consume from an external the token and validation
          const isWebAppAuthenticated = AirMapAuth.getAuth().isAuthenticated()
          const authWebAppToken = isWebAppAuthenticated ? localStorage.getItem(localStorageTokenKey) : ''
          const authSFOToken = airmapAuth.token
          const accessTokenToAppend = shouldIncludeAccessTokenInTileService
            ? `&access_token=${authSFOToken || authWebAppToken}`
            : ''

          updateSourceTileURL({
            mapInstance: map,
            sourceId: jurisdictionLayerId,
            tileSourceURL: `${jurisdictionBaseTileSourceURL}${accessTokenToAppend}`
          })
        }
      }
    },
    [
      updateMapLayersOnSourceDataLoaded,
      classifiedLayersStyles.length,
      map,
      allowDynamicRulesets,
      shouldIncludeAccessTokenInTileService
    ]
  )

  useEffect(
    function addMapListeners() {
      if (allowDynamicRulesets) {
        map.on('zoomend', handleMapMovement)
        map.on('dragend', handleMapMovement)
        map.on('sourcedata', updateMapLayersOnSourceDataLoaded)
      }
      if (showClickedAdvisoriesBox) {
        map.on('click', handleMapClicks)
      }
      map.on('error', handleMapErrors)

      return () => {
        if (allowDynamicRulesets) {
          map.off('zoomend', handleMapMovement)
          map.off('dragend', handleMapMovement)
          map.off('sourcedata', updateMapLayersOnSourceDataLoaded)
        }
        if (showClickedAdvisoriesBox) {
          map.off('click', handleMapClicks)
        }
        map.off('error', handleMapErrors)
      }
    },
    [
      handleMapClicks,
      handleMapMovement,
      handleMapErrors,
      map,
      updateMapLayersOnSourceDataLoaded,
      showClickedAdvisoriesBox,
      allowDynamicRulesets
    ]
  )

  useEffect(() => {
    return function cleanMapJurisdictions() {
      setMapJurisdictions({})
    }
  }, [setMapJurisdictions])

  useEffect(
    function setInitialMapBounds() {
      handleMapBoundsUpdates()
    },
    [handleMapBoundsUpdates]
  )

  const setLocation = useCallback(
    debounce(() => {
      if (mapBoundsGeometry.type && showLocationInformation) {
        const zoomLevel = map.getZoom()
        const [longitude, latitude] = getGeometryCenter(mapBoundsGeometry)

        fetchLocationName({ geometry: mapBoundsGeometry, zoomLevel })
        fetchWeather({ latitude, longitude })
      }
    }, 1500),
    [mapBoundsGeometry, map, fetchLocationName, fetchWeather, showLocationInformation]
  )

  useMemoiseCalls(setLocation, { geometry: mapBoundsGeometry })

  useEffect(
    function updateInjectedRulesets() {
      if (!allowDynamicRulesets && !areInjectedRulesetsHidden) {
        updateRulesetLayersMap({
          map,
          measurementUnits,
          currentMeasurementUnits,
          classifiedLayersStyles,
          unclassifiedLayersStyles,
          incomingMapJurisdictions: {},
          mapJurisdictions: {},
          filterTimeRange: { ...appliedAdvisoriesFilter },
          showInactiveAdvisories: shouldShowInactiveAdvisories,
          selectedRulesetsBySource: {},
          injectedRulesets,
          allowDynamicRulesets,
          tileServerAccessToken: filteredTileServerAccessToken,
          onRulesetsUpdate,
          injectLayerMetadata
        })
      }
    },
    [
      appliedAdvisoriesFilter,
      classifiedLayersStyles,
      injectedRulesets,
      allowDynamicRulesets,
      map,
      measurementUnits,
      shouldShowInactiveAdvisories,
      unclassifiedLayersStyles,
      filteredTileServerAccessToken,
      onRulesetsUpdate,
      injectLayerMetadata,
      areInjectedRulesetsHidden,
      currentMeasurementUnits
    ]
  )

  useEffect(() => {
    return function clearInjectedRulesets() {
      if ((allowDynamicRulesets || areInjectedRulesetsHidden) && injectedRulesets.length && visibleRulesetsIds) {
        visibleRulesetsIds.split(',').forEach(ruleset => {
          removeRuleset({ ruleset, map })
        })
      } else {
        injectedRulesets.forEach(ruleset => {
          removeRuleset({ ruleset, map })
        })
      }
    }
  }, [injectedRulesets, map, allowDynamicRulesets, visibleRulesetsIds, areInjectedRulesetsHidden])

  return (
    <div className={rulesPluginContainer}>
      <div className={`${rulesPluginHeader} ${styles[position]}`}>
        {showAdvisoriesFilter && (
          <div>
            <AdvisoriesFilter
              appliedAdvisoriesFilter={appliedAdvisoriesFilter}
              shouldShowInactiveAdvisories={shouldShowInactiveAdvisories}
              applyFilterToLayers={applyFilterToLayers}
              getAdvisoriesFromVisibleRulesets={getAdvisoriesFromVisibleRulesets}
              showInactiveAdvisories={showInactiveAdvisories}
              setAppliedAdvisoriesFilter={setAppliedAdvisoriesFilter}
              hideInactiveAdvisories={hideInactiveAdvisories}
            />
          </div>
        )}
        <div className={advisoriesRulesetsMenuWrapper}>
          {allowDynamicRulesets && !areInjectedRulesetsHidden && (
            <div>
              <RulesetsMenu
                jurisdictions={jurisdictions}
                selectedRulesets={selectedRulesets}
                setSelectedRulesets={setSelectedRulesets}
                isMapPartiallyOverUnavailableJurisdiction={isMapPartiallyOverUnavailableJurisdiction}
                fetchRulesetInformation={fetchRulesetInformation}
                rulesetInformation={rulesetInformation}
                isFetchingRulesetInformation={isFetchingRulesetInformation}
                showRulesetsMenu={showRulesetsMenu}
                injectedSelectedRulesets={injectedSelectedRulesets}
                injectedHighlightRulesets={injectedRulesets}
                isolated={isolated}
                handleMapUpdates={handleMapUpdates}
                rulesetsMenuPortalModeEnabled={rulesetsMenuPortalModeEnabled}
                rulesetsMenuPortalInlineStyles={rulesetsMenuPortalInlineStyles}
                map={map}
                useSmallStyles={useSmallRulesetsMenuStyles}
              />
            </div>
          )}

          {showAdvisoriesList && (
            <div>
              <AdvisoriesHeader
                handleSelectAdvisory={handleSelectAdvisory}
                advisoriesData={advisoriesData}
                advisoriesCounter={advisoriesCounter}
                zoomLevel={zoomLevel}
                selectedAdvisory={selectedAdvisory}
                clearSelectedAdvisory={clearSelectedAdvisory}
              />
            </div>
          )}
        </div>
      </div>
      {showToggleInjectedRulesetsVisibility && Boolean(injectedRulesets.length) && (
        <>
          <RulesetsToggle
            handleOnChange={() => {
              setAreInjectedRulesetsHidden(!areInjectedRulesetsHidden)
            }}
            isActive={!areInjectedRulesetsHidden}
          />
        </>
      )}
      {Boolean(isFetchingClickedAdvisories || clickedAdvisories.length) && showClickedAdvisoriesBox && (
        <SelectedAdvisoriesList
          selectedAdvisories={clickedAdvisories}
          clearClickedAdvisories={handleClearClickedAdvisories}
          isFetchingSelectedAdvisories={isFetchingClickedAdvisories}
          selectedAdvisory={selectedAdvisory}
          handleSelectAdvisory={handleSelectAdvisory}
          applyFilterToLayers={applyFilterToLayers}
          appliedAdvisoriesFilter={appliedAdvisoriesFilter}
          shouldShowInactiveAdvisories={shouldShowInactiveAdvisories}
          showInactiveAdvisories={showInactiveAdvisories}
          selectedAdvisorySettings={selectedAdvisorySettings}
          selectedAdvisoryHasSmallSize={selectedAdvisoryHasSmallSize}
        />
      )}
      {showLocationInformation && (
        <LocationInformation
          mapBoundsGeometryCenter={mapBoundsGeometryCenter}
          locationName={locationName}
          locationWeather={locationWeather}
        />
      )}
    </div>
  )
}

RulesPlugin.defaultProps = {
  showLocationInformation: true,
  showAdvisoriesFilter: true,
  showAdvisoriesList: true,
  showRulesetsMenu: true,
  showClickedAdvisoriesBox: true,
  injectedSelectedRulesets: null,
  menusSettings: {
    position: 'top-right',
    isolated: false
  },
  selectedAdvisorySettings: {
    cssPosition: {}
  },
  injectedRulesets: [],
  allowDynamicRulesets: true,
  tileServerAccessToken: '',
  onRulesetsUpdate: () => {},
  injectLayerMetadata: () => {},
  availableDynamicJurisdictionsUUIDs: [],
  whiteLabelAvailableJurisdictionUUIDs: [],
  allowFetchAdvisoriesData: false,
  rulesetsMenuPortalModeEnabled: false,
  rulesetsMenuPortalInlineStyles: {},
  shouldIncludeAccessTokenInTileService: true,
  selectedAdvisoryHasSmallSize: false,
  showToggleInjectedRulesetsVisibility: false,
  useSmallRulesetsMenuStyles: false
}

RulesPlugin.propTypes = {
  map: PropTypes.object.isRequired,
  measurementUnits: PropTypes.string.isRequired,
  classifiedLayersStyles: PropTypes.array.isRequired,
  unclassifiedLayersStyles: PropTypes.array.isRequired,
  mapJurisdictions: PropTypes.object.isRequired,
  setMapJurisdictions: PropTypes.func.isRequired,
  selectedAdvisory: PropTypes.string.isRequired,
  clearSelectedAdvisory: PropTypes.func.isRequired,
  setSelectedAdvisory: PropTypes.func.isRequired,
  fetchClickedAdvisories: PropTypes.func.isRequired,
  clearClickedAdvisories: PropTypes.func.isRequired,
  fetchAdvisories: PropTypes.func.isRequired,
  clickedAdvisories: PropTypes.array.isRequired,
  isFetchingClickedAdvisories: PropTypes.bool.isRequired,
  mapBoundsGeometry: PropTypes.object.isRequired,
  setMapBoundsGeometry: PropTypes.func.isRequired,
  selectedRulesetsBySource: PropTypes.object.isRequired,
  setClassifiedLayers: PropTypes.func.isRequired,
  visibleRulesetsIds: PropTypes.string.isRequired,
  setIsMapPartiallyOverUnavailableJurisdiction: PropTypes.func.isRequired,
  appliedAdvisoriesFilter: PropTypes.object.isRequired,
  shouldShowInactiveAdvisories: PropTypes.bool.isRequired,
  fetchLocationName: PropTypes.func.isRequired,
  fetchWeather: PropTypes.func.isRequired,
  setZoomLevel: PropTypes.func.isRequired,
  highlightedLayer: PropTypes.string.isRequired,
  setHighlightedLayer: PropTypes.func.isRequired,
  clearHighlightedLayer: PropTypes.func.isRequired,
  showLocationInformation: PropTypes.bool,
  showAdvisoriesFilter: PropTypes.bool,
  showAdvisoriesList: PropTypes.bool,
  showRulesetsMenu: PropTypes.bool,
  showClickedAdvisoriesBox: PropTypes.bool,
  showInactiveAdvisories: PropTypes.func.isRequired,
  mapBoundsGeometryCenter: PropTypes.object,
  locationName: PropTypes.string.isRequired,
  locationWeather: PropTypes.object.isRequired,
  advisoriesData: PropTypes.shape({
    color: PropTypes.string.isRequired,
    advisories: PropTypes.array.isRequired
  }),
  advisoriesCounter: PropTypes.number.isRequired,
  zoomLevel: PropTypes.number.isRequired,
  jurisdictions: PropTypes.object.isRequired,
  selectedRulesets: PropTypes.object.isRequired,
  setSelectedRulesets: PropTypes.func.isRequired,
  isMapPartiallyOverUnavailableJurisdiction: PropTypes.bool.isRequired,
  fetchRulesetInformation: PropTypes.func.isRequired,
  rulesetInformation: PropTypes.array.isRequired,
  isFetchingRulesetInformation: PropTypes.bool.isRequired,
  setAppliedAdvisoriesFilter: PropTypes.func.isRequired,
  hideInactiveAdvisories: PropTypes.func.isRequired,
  injectedSelectedRulesets: PropTypes.object,
  menusSettings: PropTypes.shape({
    position: PropTypes.string,
    isolated: PropTypes.bool
  }),
  selectedAdvisorySettings: PropTypes.shape({
    cssPosition: PropTypes.shape({
      top: PropTypes.string,
      bottom: PropTypes.string,
      left: PropTypes.string,
      right: PropTypes.string
    })
  }),
  injectedRulesets: PropTypes.array,
  allowDynamicRulesets: PropTypes.bool,
  tileServerAccessToken: PropTypes.string,
  onRulesetsUpdate: PropTypes.func,
  injectLayerMetadata: PropTypes.func,
  availableDynamicJurisdictionsUUIDs: PropTypes.array,
  whiteLabelAvailableJurisdictionUUIDs: PropTypes.array,
  allowFetchAdvisoriesData: PropTypes.bool,
  rulesetsMenuPortalModeEnabled: PropTypes.bool,
  rulesetsMenuPortalInlineStyles: PropTypes.object,
  shouldIncludeAccessTokenInTileService: PropTypes.bool,
  selectedAdvisoryHasSmallSize: PropTypes.bool,
  showToggleInjectedRulesetsVisibility: PropTypes.bool,
  useSmallRulesetsMenuStyles: PropTypes.bool
}
