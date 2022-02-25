import React from 'react'
import PropTypes from 'prop-types'

import styles, { alertIconWrapper } from './AdvisoryAlertIcon.styles.scss'
import { Alert } from 'modules/icons/components/Alert/Alert.component'

export const AdvisoryAlertIcon = ({ color, className }) => {
  return (
    <span className={`${alertIconWrapper} ${color ? styles[`alert-icon_${color}`] : ''} ${className}`}>
      <Alert />
    </span>
  )
}

AdvisoryAlertIcon.defaultProps = {
  color: '',
  className: ''
}

AdvisoryAlertIcon.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string
}
