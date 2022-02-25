import settings from 'settings';
export const { api: { config: { airmap: { api_key: apiKey } } }, urls: { baseJurisdictionSourceUrl, rulesetSourceUrl } } = settings;
export const rulesetsStorageKey = 'default_selected_rulesets';
export const appliedAdvisoriesFilterStorageKey = 'default_advisories_filter';
export const shouldShowInactiveAdvisoriesStorageKey = 'default_inactive_advisories_display';
export const measurementUnits = {
    AIRMAP: 'airmap',
    SI: 'si',
    KILOMETERS: 'kilometers',
    METERS: 'meters'
};
export const rulesetClassifications = {
    NON_CLASSIFIED: 'unclassified',
    NON_GEO: 'non_geo',
    HELIPORT: 'heliport',
    NOTICES_TO_AIRMEN: 'notam',
    TEMPORARY_FLIGHT_RESTRICTIONS: 'tfr',
    BUILDINGS_3D: '3d-buildings',
    SPECIAL_USE_AIRSPACE: 'special_use_airspace',
    CONTROLLED_AIRSPACE: 'controlled_airspace'
};
export const layerFilters = {
    CLASSIFICATION_TYPES: 'classification_types'
};
export const controlledAirspaceSubTypes = ['b', 'c', 'd', 'e'];
export const rulesetSelectionTypes = {
    OPTIONAL: 'optional',
    REQUIRED: 'required',
    PICK_ONE: 'pick1'
};
export const sourceTypes = {
    VECTOR: 'vector'
};
export const layerTypes = {
    LINE: 'line',
    SYMBOL: 'symbol',
    FILL: 'fill',
    JURISDICTIONS: 'jurisdictions',
    AIRMAP: 'airmap',
    BACKGROUND: 'background',
    OVERLAY: 'overlay'
};
export const geometryTypes = {
    POINT: 'Point'
};
export const jurisdictionBaseTileSourceURL = `${baseJurisdictionSourceUrl}?apikey=${apiKey}`;
export const jurisdictionLayer = {
    id: layerTypes.JURISDICTIONS,
    type: layerTypes.FILL,
    'source-layer': layerTypes.JURISDICTIONS,
    minZoom: 6,
    maxZoom: 22
};
export const timestampFormatting = {
    DATE: 'YYYY-MM-DD',
    DATE_SLASHED: 'DD/MM/YYYY',
    DATE_SLASHED_MONTH_FIRST: 'MM/DD/YYYY',
    DAY: 'dddd',
    DAY_SHORT: 'ddd',
    TIME_AM_PM: 'hh:mm A',
    TIME_AM_PM_TZ: 'hh:mm A z',
    LOCALE_TIME: 'LT',
    LOCALE_DATE: 'L'
};
export const advisoryColors = {
    green: '#66CC33',
    yellow: '#F9E547',
    red: '#D0011B',
    blue: '#407EC9',
    navy: '#333F48',
    light_blue: '#F3FBFB',
    gray: '#999999',
    light_gray: '#E1E1E1',
    orange: '#FC4C02',
    teal: '#88DBDF',
    light_teal: '#E7F8F9',
    black: '#363e47',
    dark_orange: '#f6a517',
    white: '#FFF',
    neutral3: '#848f98'
};
export const layerColors = {
    HIGHLIGHTED: '#F9E547'
};
export const layerColorsOrder = {
    red: 1,
    orange: 2,
    yellow: 3,
    white: 4,
    green: 5,
    'Not found.': 6
};
export const advisoriesColorTypes = {
    YELLOW: 'yellow'
};
export const zoomLevels = {
    ADVISORIES_ZOOM_REQUIRED: 11
};
export const layersIds = {
    BACKGROUND: 'background',
    UNSUPPORTED_JURISDICTIONS_FILL: 'airmap|unsupported_jurisdictions|fill',
    UNSUPPORTED_JURISDICTIONS_SYMBOL: 'airmap|unsupported_jurisdictions|symbol',
    SUPPORTED_JURISDICTIONS_LINE: 'airmap|supported_jurisdictions|line'
};
export const temperatureUnits = {
    CELSIUS: '° C',
    FAHRENHEIT: '° F'
};
export const CLOSE_RULES_MENU = 'CLOSE_RULES_MENU';
export const CLOSE_RULES_MENU_EVENT = new Event(CLOSE_RULES_MENU);
export const selectableRulesets = [rulesetSelectionTypes.OPTIONAL, rulesetSelectionTypes.PICK_ONE];
