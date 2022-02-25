import React, { useCallback, useState, useMemo } from 'react'
import PropTypes from 'prop-types'

import { airmapIntl } from 'libs/airmap-intl'
import { getTimeFromAdvisory, getPhoneNumberFromAdvisory } from './AdvisoryDetail.helpers'
import { AdvisoryDetailMessages } from './AdvisoryDetail.messages'
import {
  inactiveColor,
  detailWrapper,
  selectedAdvisory,
  detailContent,
  advisoryTitle,
  advisoryText,
  activeText,
  warnings,
  warningPill,
  scheduleButtonWrapper,
  collapseScheduleButton,
  collapseIcon,
  collapseIconExpanded,
  offsetBanner
} from './AdvisoryDetail.styles.scss'
import { advisoriesColorTypes, advisoryColors } from '../../constants/rules-plugin.constants'
import { getDeviceTimeZone } from 'modules/rules-plugin/helpers/rules-plugin.helpers'
import { AdvisorySchedule } from '../AdvisorySchedule/AdvisorySchedule.component'
import { AdvisoryAlertIcon } from '../AdvisoryAlertIcon/AdvisoryAlertIcon.component'
import { Collapse } from '@material-ui/core'
import { CalendarMonth } from 'modules/icons/components/CalendarMonth/CalendarMonth.component'
import { ChevronRight } from 'modules/icons/components/ChevronRight/ChevronRight.component'

export const AdvisoryDetail = ({
  advisory: {
    properties: { body, description, ...properties },
    type,
    name,
    color,
    schedule,
    requirements,
    isActive,
    isActiveUnknown,
    counter,
    ...advisoryData
  },
  showAdvisoryType,
  handleSelectAdvisory,
  isAdvisorySelected
}) => {
  const isYellowColorType = color === advisoriesColorTypes.YELLOW
  const inactiveAdvisoryClass = !isActive && !isActiveUnknown ? inactiveColor : ''
  const advisoryTime = getTimeFromAdvisory(properties)
  const shouldShowActiveLabel = isActive && advisoryTime && !schedule
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false)
  const phoneNumber = getPhoneNumberFromAdvisory(requirements)
  const advisoryType = AdvisoryDetailMessages[`advisoryLabel_${type}`]
    ? airmapIntl.translateMessage(AdvisoryDetailMessages[`advisoryLabel_${type}`])
    : type

  const handleAdvisoryClick = useCallback(() => handleSelectAdvisory({ ...advisoryData, type }), [
    advisoryData,
    handleSelectAdvisory,
    type
  ])

  const deviceTimezone = getDeviceTimeZone()

  const hasTimeZoneDiffered = useMemo(() => {
    return schedule && deviceTimezone !== schedule[0].data.utc_offset
  }, [schedule, deviceTimezone])

  const onScheduleButtonClick = event => {
    event.stopPropagation()
    setIsScheduleExpanded(!isScheduleExpanded)
  }

  return (
    <div className={`${detailWrapper} ${isAdvisorySelected ? selectedAdvisory : ''}`} onClick={handleAdvisoryClick}>
      <div className={warnings}>
        <span
          className={warningPill}
          style={{ backgroundColor: color, color: isYellowColorType ? advisoryColors.navy : advisoryColors.white }}
        >
          {counter}
        </span>
      </div>

      <div className={detailContent}>
        {showAdvisoryType && <h3 className={`${advisoryTitle} ${inactiveAdvisoryClass}`}>{advisoryType}</h3>}

        <p className={`${advisoryText} ${inactiveAdvisoryClass}`}>
          {name || airmapIntl.translateMessage(AdvisoryDetailMessages.unknown)}
        </p>

        {body && <p className={`${advisoryText} ${inactiveAdvisoryClass}`}>{body}</p>}

        {description && <p className={`${advisoryText} ${inactiveAdvisoryClass}`}>{description}</p>}

        {shouldShowActiveLabel && (
          <p className={`${advisoryText} ${activeText}`}>
            {airmapIntl.translateMessage(AdvisoryDetailMessages.active)}
          </p>
        )}

        {phoneNumber && <p className={`${advisoryText} ${inactiveAdvisoryClass}`}>{phoneNumber}</p>}

        {schedule && (
          <>
            <div className={scheduleButtonWrapper}>
              <button className={collapseScheduleButton} onClick={onScheduleButtonClick}>
                <CalendarMonth />
                {airmapIntl.translateMessage(AdvisoryDetailMessages.schedule)}
                <ChevronRight className={`${collapseIcon} ${isScheduleExpanded ? collapseIconExpanded : ''}`} />
              </button>

              <span className={activeText}>{airmapIntl.translateMessage(AdvisoryDetailMessages.active)}</span>
            </div>

            <Collapse in={isScheduleExpanded}>
              {hasTimeZoneDiffered && (
                <div className={offsetBanner}>
                  <AdvisoryAlertIcon />
                  <span>
                    {airmapIntl.translateMessage(AdvisoryDetailMessages.offsetBanner, {
                      deviceTimezone
                    })}
                  </span>
                </div>
              )}
              <AdvisorySchedule schedule={schedule} isAdvisoryActive={true} />
            </Collapse>
          </>
        )}
      </div>
    </div>
  )
}

AdvisoryDetail.defaultProps = {
  children: '',
  showAdvisoryType: true
}

AdvisoryDetail.propTypes = {
  advisory: PropTypes.object.isRequired,
  children: PropTypes.node,
  showAdvisoryType: PropTypes.bool,
  handleSelectAdvisory: PropTypes.func.isRequired,
  isAdvisorySelected: PropTypes.bool.isRequired
}
