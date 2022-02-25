import React from 'react'
import PropTypes from 'prop-types'
import { getTemperatureString } from '../../helpers/rules-plugin.helpers'
import { capitalizeEachWordAndRemoveSpacing } from 'modules/core/helpers/utilities.helpers'
import SvgIcon from '@material-ui/core/SvgIcon'
import Tooltip from '@material-ui/core/Tooltip'
import * as WeatherIcons from 'projects/web-app/icons/weather'
import classes from './LocationInformation.styles.scss'
import { getDMSCoordinates } from 'projects/SFO/modules/map/helpers/map-units.helpers'
import { MeasurementTypes } from 'modules/core/constants/measurement-types.constants'

export const LocationInformation = ({ mapBoundsGeometryCenter, locationName, locationWeather }) => {
  const icon =
    locationWeather.icon &&
    capitalizeEachWordAndRemoveSpacing(locationWeather.icon)
      .split(' ')
      .join('')

  const hasGeometryCenter = mapBoundsGeometryCenter.latitude && mapBoundsGeometryCenter.longitude
  const isLocationWeatherLoaded = Boolean(locationWeather.temperature && locationWeather.icon)
  const iconTooltip = isLocationWeatherLoaded && capitalizeEachWordAndRemoveSpacing(locationWeather.icon)

  return (
    <div className={classes.welcomeHeaderWrapper} id="CommandCenterHeader">
      <div className={classes.welcomeTitle}>
        {locationName && <h3 className={`${classes.highlightBackground} ${classes.location}`}>{locationName}</h3>}

        {hasGeometryCenter && (
          <h4 className={`${classes.highlightBackground} ${classes.coordinates}`}>
            {getDMSCoordinates([mapBoundsGeometryCenter.latitude, mapBoundsGeometryCenter.longitude])}
          </h4>
        )}
      </div>
      {isLocationWeatherLoaded && (
        <div className={classes.weatherWrapper}>
          {icon && (
            <Tooltip title={iconTooltip}>
              <SvgIcon
                viewBox="-16 -16 160 160"
                preserveAspectRatio="xMidYMid meet"
                className={classes.weatherIcon}
                style={{ height: 45, width: 45 }}
              >
                {WeatherIcons[icon]()}
              </SvgIcon>
            </Tooltip>
          )}

          {locationWeather.temperature && (
            <p className={classes.weatherText}>
              {`${getTemperatureString(MeasurementTypes.IMPERIAL, locationWeather.temperature)}/${getTemperatureString(
                MeasurementTypes.METRIC,
                locationWeather.temperature
              )}`}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

LocationInformation.propTypes = {
  mapBoundsGeometryCenter: PropTypes.object,
  locationName: PropTypes.string.isRequired,
  locationWeather: PropTypes.object.isRequired
}
