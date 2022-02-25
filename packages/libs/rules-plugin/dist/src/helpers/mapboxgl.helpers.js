import mapboxClient from '@mapbox/mapbox-sdk';
import mapboxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import settings from 'settings';
import turfCenter from '@turf/center';
const baseClient = mapboxClient({ accessToken: settings.api.config.mapbox.access_token });
const geocodingService = mapboxGeocoding(baseClient);
const geocodingFeatureTypes = {
    PLACE: 'place',
    REGION: 'region',
    COUNTRY: 'country'
};
export const getGeometryCenter = geometry => {
    const center = turfCenter(geometry);
    return center.geometry.coordinates;
};
export const getLocationNameByCoordinates = async ({ geometry, zoomLevel }) => {
    try {
        const response = await geocodingService
            .reverseGeocode({
            query: getGeometryCenter(geometry)
        })
            .send();
        const placeName = reverseGeoLocationNameByZoomLevel(response.body.features, zoomLevel);
        return placeName;
    }
    catch (err) {
        return null;
    }
};
const reverseGeoLocationNameByZoomLevel = (features, zoomLevel) => {
    const shouldShowPlace = zoomLevel > 8;
    const shouldShowRegion = zoomLevel > 5 && !shouldShowPlace;
    return features.reduce((locationName, feature) => {
        const isFeatureTypePlace = feature.id.includes(geocodingFeatureTypes.PLACE);
        const isFeatureTypeRegion = feature.id.includes(geocodingFeatureTypes.REGION);
        if (shouldShowPlace && isFeatureTypePlace) {
            return feature.text;
        }
        if (shouldShowRegion && isFeatureTypeRegion) {
            return feature.text;
        }
        return locationName;
    }, '');
};
