import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { getTemperatureString } from '../../helpers/rules-plugin.helpers';
import { capitalizeEachWordAndRemoveSpacing } from 'modules/core/helpers/utilities.helpers';
import SvgIcon from '@material-ui/core/SvgIcon';
import Tooltip from '@material-ui/core/Tooltip';
import * as WeatherIcons from 'projects/web-app/icons/weather';
import classes from './LocationInformation.styles.scss';
import { getDMSCoordinates } from 'projects/SFO/modules/map/helpers/map-units.helpers';
import { MeasurementTypes } from 'modules/core/constants/measurement-types.constants';
export const LocationInformation = ({ mapBoundsGeometryCenter, locationName, locationWeather }) => {
    const icon = locationWeather.icon &&
        capitalizeEachWordAndRemoveSpacing(locationWeather.icon)
            .split(' ')
            .join('');
    const hasGeometryCenter = mapBoundsGeometryCenter.latitude && mapBoundsGeometryCenter.longitude;
    const isLocationWeatherLoaded = Boolean(locationWeather.temperature && locationWeather.icon);
    const iconTooltip = isLocationWeatherLoaded && capitalizeEachWordAndRemoveSpacing(locationWeather.icon);
    return (_jsxs("div", { className: classes.welcomeHeaderWrapper, id: "CommandCenterHeader", children: [_jsxs("div", { className: classes.welcomeTitle, children: [locationName && _jsx("h3", { className: `${classes.highlightBackground} ${classes.location}`, children: locationName }, void 0), hasGeometryCenter && (_jsx("h4", { className: `${classes.highlightBackground} ${classes.coordinates}`, children: getDMSCoordinates([mapBoundsGeometryCenter.latitude, mapBoundsGeometryCenter.longitude]) }, void 0))] }, void 0), isLocationWeatherLoaded && (_jsxs("div", { className: classes.weatherWrapper, children: [icon && (_jsx(Tooltip, { title: iconTooltip, children: _jsx(SvgIcon, { viewBox: "-16 -16 160 160", preserveAspectRatio: "xMidYMid meet", className: classes.weatherIcon, style: { height: 45, width: 45 }, children: WeatherIcons[icon]() }, void 0) }, void 0)), locationWeather.temperature && (_jsx("p", { className: classes.weatherText, children: `${getTemperatureString(MeasurementTypes.IMPERIAL, locationWeather.temperature)}/${getTemperatureString(MeasurementTypes.METRIC, locationWeather.temperature)}` }, void 0))] }, void 0))] }, void 0));
};
LocationInformation.propTypes = {
    mapBoundsGeometryCenter: PropTypes.object,
    locationName: PropTypes.string.isRequired,
    locationWeather: PropTypes.object.isRequired
};
