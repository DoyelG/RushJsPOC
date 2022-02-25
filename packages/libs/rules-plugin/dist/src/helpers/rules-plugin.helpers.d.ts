export function getRulesetSource({ ruleset, measurementUnits, tileServerAccessToken, appendQuery, appendFilter }: {
    ruleset: any;
    measurementUnits: any;
    tileServerAccessToken: any;
    appendQuery?: string | undefined;
    appendFilter?: null | undefined;
}): {
    type: string;
    tiles: string[];
    minzoom: number;
    maxzoom: number;
};
export function setAppliedFilterToLayers({ map, timeRange: { start: startTime, end: endTime }, showInactiveAdvisories }: {
    map: any;
    timeRange: {
        start: any;
        end: any;
    };
    showInactiveAdvisories: any;
}): void;
export function removeRuleset({ ruleset, map, condition }: {
    ruleset: any;
    map: any;
    condition?: boolean | undefined;
}): void;
export function sortAdvisories({ advisories, advisoryId }: {
    advisories: any;
    advisoryId: any;
}): any;
export function moveToSelectedLayer({ map, advisoryId, longitude, latitude }: {
    map: any;
    advisoryId: any;
    longitude: any;
    latitude: any;
}): void;
export function getClickedGeometry(lngLat: any): any;
export function classifyLayers(layers: any): any;
export function getJurisdictionsFromMap(map: any, availableDynamicJurisdictions: any, availableJurisdictionUUIDs: any): any;
export function updateRulesetLayersMap({ map, measurementUnits, currentMeasurementUnits, classifiedLayersStyles, unclassifiedLayersStyles, incomingMapJurisdictions, mapJurisdictions, filterTimeRange, showInactiveAdvisories, selectedRulesetsBySource, injectedRulesets, allowDynamicRulesets, tileServerAccessToken, onRulesetsUpdate, injectLayerMetadata }: {
    map: any;
    measurementUnits: any;
    currentMeasurementUnits: any;
    classifiedLayersStyles: any;
    unclassifiedLayersStyles: any;
    incomingMapJurisdictions: any;
    mapJurisdictions: any;
    filterTimeRange: any;
    showInactiveAdvisories: any;
    selectedRulesetsBySource: any;
    injectedRulesets: any;
    allowDynamicRulesets: any;
    tileServerAccessToken: any;
    onRulesetsUpdate: any;
    injectLayerMetadata: any;
}): any;
export function getDeviceTimeZone(): any;
export function getUrlWithHTTP(url: any): any;
export function getMapBoundsBbox(bounds: any): any;
export function parseAdvisoriesByType(advisories: any): any;
export function groupRulesets(rulesets: any): any;
export function getDefaultSelectedRulesets(jurisdictions: any, selectedRulesets: any): {
    [x: string]: any;
};
export function updateSourceTileURL({ mapInstance, sourceId, tileSourceURL }: {
    mapInstance: any;
    sourceId: any;
    tileSourceURL: any;
}): void;
export function createRestrictedZoneDelimiters({ map, availableJurisdictionUUIDs }: {
    map: any;
    availableJurisdictionUUIDs: any;
}): void;
export function getCachedSelectedRulesets(): {
    pick1: {};
    optional: {};
};
export function getCachedAppliedAdvisoriesFilter(): {
    formattedValue: string;
    start: string;
    end: string;
};
export function getCachedShouldShowInactiveAdvisories(): boolean;
export function getTemperatureString(units: any, temperature: any): string;
export function getSelectableRulesets(selectedRulesets: any): {};
