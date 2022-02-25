export function createRulesPluginThunks(rulesPluginActions: any, rulesPluginSelectors: any): {
    fetchClickedAdvisories: ({ lngLat, advisoryId, rulesetsIds }: {
        lngLat: any;
        advisoryId: any;
        rulesetsIds: any;
    }) => (dispatch: any, getState: any) => Promise<void>;
    fetchAdvisories: ({ rulesetsIds, mapBoundsGeometry }: {
        rulesetsIds: any;
        mapBoundsGeometry: any;
    }) => (dispatch: any, getState: any) => Promise<void>;
    fetchLocationName: ({ geometry, zoomLevel }: {
        geometry: any;
        zoomLevel: any;
    }) => (dispatch: any) => Promise<void>;
    fetchRulesetInformation: (rulesetId: any) => (dispatch: any) => Promise<void>;
    fetchWeather: ({ latitude, longitude }: {
        latitude: any;
        longitude: any;
    }) => (dispatch: any) => Promise<void>;
};
