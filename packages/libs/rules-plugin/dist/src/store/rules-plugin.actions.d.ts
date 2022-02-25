export function createRulesPluginActions(rulesPluginId: any): {
    setClassifiedLayers: (classifiedLayers: any) => {
        type: string;
        rulesPluginId: any;
        classifiedLayers: any;
    };
    setMapJurisdictions: (mapJurisdictions: any) => {
        type: string;
        rulesPluginId: any;
        mapJurisdictions: any;
    };
    setSelectedAdvisory: (advisory: any) => {
        type: string;
        rulesPluginId: any;
        advisory: any;
    };
    clearSelectedAdvisory: () => {
        type: string;
        rulesPluginId: any;
    };
    setClickedAdvisories: (advisories: any) => {
        type: string;
        rulesPluginId: any;
        advisories: any;
    };
    clearClickedAdvisories: () => {
        type: string;
        rulesPluginId: any;
    };
    setIsFetchingClickedAdvisories: () => {
        type: string;
        rulesPluginId: any;
    };
    setClickedAdvisoriesFetched: () => {
        type: string;
        rulesPluginId: any;
    };
    setAdvisories: ({ parsedAdvisories, advisoriesCounter }: {
        parsedAdvisories: any;
        advisoriesCounter: any;
    }) => {
        type: string;
        rulesPluginId: any;
        parsedAdvisories: any;
        advisoriesCounter: any;
    };
    clearAdvisories: () => {
        type: string;
        rulesPluginId: any;
    };
    setMapBoundsGeometry: (geometry: any) => {
        type: string;
        rulesPluginId: any;
        geometry: any;
    };
    setSelectedRulesets: (rulesets: any) => {
        type: string;
        rulesPluginId: any;
        rulesets: any;
    };
    setIsMapPartiallyOverUnavailableJurisdiction: (status: any) => {
        type: string;
        rulesPluginId: any;
        status: any;
    };
    setRulesetInformation: (rulesetInformation: any) => {
        type: string;
        rulesPluginId: any;
        rulesetInformation: any;
    };
    setIsFetchingRulesetInformation: (status: any) => {
        type: string;
        rulesPluginId: any;
        status: any;
    };
    setAppliedAdvisoriesFilter: (value: any) => {
        type: string;
        rulesPluginId: any;
        value: any;
    };
    showInactiveAdvisories: () => {
        type: string;
        rulesPluginId: any;
    };
    hideInactiveAdvisories: () => {
        type: string;
        rulesPluginId: any;
    };
    setLocationName: (locationName: any) => {
        type: string;
        rulesPluginId: any;
        locationName: any;
    };
    setLocationWeather: (locationWeather: any) => {
        type: string;
        rulesPluginId: any;
        locationWeather: any;
    };
    setZoomLevel: (zoomLevel: any) => {
        type: string;
        rulesPluginId: any;
        zoomLevel: any;
    };
    setHighlightedLayer: (layerId: any) => {
        type: string;
        rulesPluginId: any;
        layerId: any;
    };
    clearHighlightedLayer: () => {
        type: string;
        rulesPluginId: any;
    };
};
