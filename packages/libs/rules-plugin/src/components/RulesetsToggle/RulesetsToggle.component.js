import React from 'react'
import PropTypes from 'prop-types'
import { Layer } from 'modules/icons/components/Layer/Layer.component'
import { IconButton } from 'ui-styling/components/buttons/IconButton/IconButton.component'
import { toggle_button, toggleable_menu } from './RulesetsToggle.styles.scss'

export const RulesetsToggle = ({ handleOnChange, className, isActive }) => {
  return (
    <div className={toggleable_menu} id="rulesets-toggle" onClick={handleOnChange}>
      <IconButton
        className={`${className} ${toggle_button}`}
        id="rulesets-toggle-icon"
        icon={<Layer width={21} height={24} fillColor={isActive ? '#848f98' : '#cfd3d7'} />}
      />
    </div>
  )
}

RulesetsToggle.defaultProps = {
  className: '',
  isActive: true
}

RulesetsToggle.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  isActive: PropTypes.bool
}
