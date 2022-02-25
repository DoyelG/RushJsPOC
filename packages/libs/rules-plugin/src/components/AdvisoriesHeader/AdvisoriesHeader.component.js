import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Collapse } from '@material-ui/core'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'

import { airmapIntl } from 'libs/airmap-intl'
import { AdvisoriesHeaderMessages } from './AdvisoriesHeader.messages'
import { useManageMenusToggling } from '../../hooks/useManageMenusToggling.hook'
import { advisoryColors, zoomLevels } from '../../constants/rules-plugin.constants'
import { AdvisoryAlertIcon } from '../AdvisoryAlertIcon/AdvisoryAlertIcon.component'
import {
  advisoriesMenuContainer,
  advisoriesMenuWrapper,
  cardHeader,
  advisoriesHeaderWrapper,
  alertIcon,
  advisoriesHeaderText,
  advisoriesHeaderCount,
  arrowButton,
  arrowIcon,
  zoomInMessageWrapper,
  zoomInMessage,
  collapse,
  menuContent
} from './AdvisoriesHeader.styles.scss'
import { AdvisoriesList } from '../AdvisoriesList/AdvisoriesList.component'
import { IconButton } from 'ui-styling/components/buttons/IconButton/IconButton.component'

export const AdvisoriesHeader = ({
  advisoriesData,
  advisoriesCounter,
  zoomLevel,
  handleSelectAdvisory,
  selectedAdvisory,
  clearSelectedAdvisory
}) => {
  const iconColor = advisoriesData.color || advisoryColors.green
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { ADVISORIES_ZOOM_REQUIRED } = zoomLevels
  const isZoomed = zoomLevel >= ADVISORIES_ZOOM_REQUIRED
  const menuButtonId = 'advisories-menu-button'

  useManageMenusToggling(() => {
    setIsMenuOpen(false)
  }, menuButtonId)

  return (
    <div className={advisoriesMenuContainer}>
      <div className={advisoriesMenuWrapper}>
        {isZoomed && (
          <div className={`${cardHeader} toggleable-menu`} onClick={() => setIsMenuOpen(!isMenuOpen)} id={menuButtonId}>
            <span className={advisoriesHeaderWrapper}>
              <AdvisoryAlertIcon color={iconColor} className={alertIcon} />
              <span className={advisoriesHeaderText}>
                {airmapIntl.translateMessage(AdvisoriesHeaderMessages.advisories_header)}
                <span className={advisoriesHeaderCount}>({advisoriesCounter})</span>
              </span>
              <IconButton
                className={arrowButton}
                id="advisories-menu-icon"
                onClick={() => {}}
                icon={
                  isMenuOpen ? (
                    <KeyboardArrowDownIcon className={arrowIcon} />
                  ) : (
                    <KeyboardArrowUpIcon className={arrowIcon} />
                  )
                }
              />
            </span>
          </div>
        )}
        {!isZoomed && (
          <div className={cardHeader}>
            <span className={advisoriesHeaderWrapper} style={{ color: advisoryColors.navy }}>
              <div className={zoomInMessageWrapper}>
                <AdvisoryAlertIcon className={alertIcon} />
                <span className={`${advisoriesHeaderText} ${zoomInMessage}`}>
                  {airmapIntl.translateMessage(AdvisoriesHeaderMessages.zoom_in_message)}
                </span>
              </div>
            </span>
          </div>
        )}
      </div>
      {isZoomed && (
        <Collapse in={isMenuOpen} className={collapse} timeout="auto" unmountOnExit>
          <div className={menuContent}>
            <AdvisoriesList
              selectedAdvisory={selectedAdvisory}
              advisoriesData={advisoriesData}
              handleSelectAdvisory={handleSelectAdvisory}
              clearSelectedAdvisory={clearSelectedAdvisory}
            />
          </div>
        </Collapse>
      )}
    </div>
  )
}

AdvisoriesHeader.propTypes = {
  advisoriesData: PropTypes.shape({
    color: PropTypes.string.isRequired,
    advisories: PropTypes.array.isRequired
  }),
  advisoriesCounter: PropTypes.number.isRequired,
  zoomLevel: PropTypes.number.isRequired,
  handleSelectAdvisory: PropTypes.func.isRequired,
  selectedAdvisory: PropTypes.string.isRequired,
  clearSelectedAdvisory: PropTypes.func.isRequired
}
