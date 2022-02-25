export const apiKey: any;
export const baseJurisdictionSourceUrl: any;
export const rulesetSourceUrl: any;
export const rulesetsStorageKey: "default_selected_rulesets";
export const appliedAdvisoriesFilterStorageKey: "default_advisories_filter";
export const shouldShowInactiveAdvisoriesStorageKey: "default_inactive_advisories_display";
export namespace measurementUnits {
    const AIRMAP: string;
    const SI: string;
    const KILOMETERS: string;
    const METERS: string;
}
export namespace rulesetClassifications {
    const NON_CLASSIFIED: string;
    const NON_GEO: string;
    const HELIPORT: string;
    const NOTICES_TO_AIRMEN: string;
    const TEMPORARY_FLIGHT_RESTRICTIONS: string;
    const BUILDINGS_3D: string;
    const SPECIAL_USE_AIRSPACE: string;
    const CONTROLLED_AIRSPACE: string;
}
export namespace layerFilters {
    const CLASSIFICATION_TYPES: string;
}
export const controlledAirspaceSubTypes: string[];
export namespace rulesetSelectionTypes {
    const OPTIONAL: string;
    const REQUIRED: string;
    const PICK_ONE: string;
}
export namespace sourceTypes {
    const VECTOR: string;
}
export namespace layerTypes {
    export const LINE: string;
    export const SYMBOL: string;
    export const FILL: string;
    export const JURISDICTIONS: string;
    const AIRMAP_1: string;
    export { AIRMAP_1 as AIRMAP };
    export const BACKGROUND: string;
    export const OVERLAY: string;
}
export namespace geometryTypes {
    const POINT: string;
}
export const jurisdictionBaseTileSourceURL: string;
export const jurisdictionLayer: {
    id: string;
    type: string;
    'source-layer': string;
    minZoom: number;
    maxZoom: number;
};
export namespace timestampFormatting {
    const DATE: string;
    const DATE_SLASHED: string;
    const DATE_SLASHED_MONTH_FIRST: string;
    const DAY: string;
    const DAY_SHORT: string;
    const TIME_AM_PM: string;
    const TIME_AM_PM_TZ: string;
    const LOCALE_TIME: string;
    const LOCALE_DATE: string;
}
export namespace advisoryColors {
    const green: string;
    const yellow: string;
    const red: string;
    const blue: string;
    const navy: string;
    const light_blue: string;
    const gray: string;
    const light_gray: string;
    const orange: string;
    const teal: string;
    const light_teal: string;
    const black: string;
    const dark_orange: string;
    const white: string;
    const neutral3: string;
}
export namespace layerColors {
    const HIGHLIGHTED: string;
}
export const layerColorsOrder: {
    red: number;
    orange: number;
    yellow: number;
    white: number;
    green: number;
    'Not found.': number;
};
export namespace advisoriesColorTypes {
    const YELLOW: string;
}
export namespace zoomLevels {
    const ADVISORIES_ZOOM_REQUIRED: number;
}
export namespace layersIds {
    const BACKGROUND_1: string;
    export { BACKGROUND_1 as BACKGROUND };
    export const UNSUPPORTED_JURISDICTIONS_FILL: string;
    export const UNSUPPORTED_JURISDICTIONS_SYMBOL: string;
    export const SUPPORTED_JURISDICTIONS_LINE: string;
}
export namespace temperatureUnits {
    const CELSIUS: string;
    const FAHRENHEIT: string;
}
export const CLOSE_RULES_MENU: "CLOSE_RULES_MENU";
export const CLOSE_RULES_MENU_EVENT: Event;
export const selectableRulesets: string[];
