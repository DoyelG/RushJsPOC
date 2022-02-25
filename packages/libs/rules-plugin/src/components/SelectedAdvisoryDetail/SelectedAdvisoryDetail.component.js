import React, { useState, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { airmapIntl } from 'libs/airmap-intl'

import { Collapse } from '@material-ui/core'
import { getDeviceTimeZone, getUrlWithHTTP } from '../../helpers/rules-plugin.helpers'
import { CalendarMonth } from 'modules/icons/components/CalendarMonth/CalendarMonth.component'
import { ChevronRight } from 'modules/icons/components/ChevronRight/ChevronRight.component'
import { Link } from 'modules/icons/components/Link/Link.component'
import { AdvisorySchedule } from '../AdvisorySchedule/AdvisorySchedule.component'
import { AdvisoryAlertIcon } from '../AdvisoryAlertIcon/AdvisoryAlertIcon.component'
import { getTimeFromAdvisory, getPhoneNumberFromAdvisory } from '../AdvisoryDetail/AdvisoryDetail.helpers'
import { SelectedAdvisoryDetailMessages } from './SelectedAdvisoryDetail.messages'
import {
  inactiveColor,
  detailWrapper,
  selectedAdvisory,
  detailContent,
  advisoryTitle,
  advisoryText,
  activeText,
  scheduleButtonWrapper,
  collapseScheduleButton,
  collapseIcon,
  collapseIconExpanded,
  offsetBanner,
  externalLink
} from './SelectedAdvisoryDetail.styles.scss'

export const SelectedAdvisoryDetail = ({
  advisory: {
    properties: { url, body, description, ...properties },
    type,
    name,
    color,
    schedule,
    requirements,
    isActive,
    isActiveUnknown,
    ...advisoryData
  },
  showAdvisoryType,
  handleSelectAdvisory,
  isAdvisorySelected
}) => {
  const inactiveAdvisoryClass = !isActive && !isActiveUnknown ? inactiveColor : ''
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false)
  const advisoryTime = getTimeFromAdvisory(properties)
  const shouldShowActiveLabel = isActive && advisoryTime && !schedule
  const phoneNumber = getPhoneNumberFromAdvisory(requirements)
  const advisoryType = SelectedAdvisoryDetailMessages[`advisoryLabel_${type}`]
    ? airmapIntl.translateMessage(SelectedAdvisoryDetailMessages[`advisoryLabel_${type}`])
    : type

  const deviceTimezone = getDeviceTimeZone()

  const hasTimeZoneDiffered = useMemo(() => {
    return schedule && deviceTimezone !== schedule[0].data.utc_offset
  }, [schedule, deviceTimezone])

  const toggleSchedule = useCallback(
    e => {
      e.stopPropagation()
      setIsScheduleExpanded(!isScheduleExpanded)
    },
    [isScheduleExpanded]
  )

  const handleAdvisoryClick = useCallback(() => handleSelectAdvisory({ ...advisoryData, type }), [
    advisoryData,
    handleSelectAdvisory,
    type
  ])

  return (
    <div className={`${detailWrapper} ${isAdvisorySelected ? selectedAdvisory : ''}`} onClick={handleAdvisoryClick}>
      <AdvisoryAlertIcon color={color} />

      <div className={detailContent}>
        {showAdvisoryType && <h3 className={`${advisoryTitle} ${inactiveAdvisoryClass}`}>{advisoryType}</h3>}

        <p className={`${advisoryText} ${inactiveAdvisoryClass}`}>
          {name || airmapIntl.translateMessage(SelectedAdvisoryDetailMessages.unknown)}
        </p>

        {body && <p className={`${advisoryText} ${inactiveAdvisoryClass}`}>{body}</p>}

        {description && <p className={`${advisoryText} ${inactiveAdvisoryClass}`}>{description}</p>}

        {shouldShowActiveLabel && (
          <p className={`${advisoryText} ${activeText}`}>
            {airmapIntl.translateMessage(SelectedAdvisoryDetailMessages.active)}
          </p>
        )}

        {phoneNumber && <p className={`${advisoryText} ${inactiveAdvisoryClass}`}>{phoneNumber}</p>}

        {schedule && (
          <>
            <div className={scheduleButtonWrapper}>
              <button className={collapseScheduleButton} onClick={toggleSchedule}>
                <CalendarMonth />
                {airmapIntl.translateMessage(SelectedAdvisoryDetailMessages.schedule)}
                <ChevronRight className={`${collapseIcon} ${isScheduleExpanded ? collapseIconExpanded : ''}`} />
              </button>

              {isActive ? (
                <span className={activeText}>{airmapIntl.translateMessage(SelectedAdvisoryDetailMessages.active)}</span>
              ) : (
                <span className={inactiveColor}>
                  {airmapIntl.translateMessage(
                    isActiveUnknown ? SelectedAdvisoryDetailMessages.unknown : SelectedAdvisoryDetailMessages.inactive
                  )}
                </span>
              )}
            </div>

            <Collapse in={isScheduleExpanded}>
              {hasTimeZoneDiffered && (
                <div className={offsetBanner}>
                  <AdvisoryAlertIcon />
                  <span>
                    {airmapIntl.translateMessage(SelectedAdvisoryDetailMessages.offsetBanner, {
                      deviceTimezone
                    })}
                  </span>
                </div>
              )}
              <AdvisorySchedule schedule={schedule} isAdvisoryActive={isActive || isActiveUnknown} />
            </Collapse>
          </>
        )}
      </div>
      {url && (
        <a className={externalLink} href={getUrlWithHTTP(url)} target="_blank" rel="noopener noreferrer">
          <Link />
        </a>
      )}
    </div>
  )
}

SelectedAdvisoryDetail.defaultProps = {
  children: '',
  showAdvisoryType: true
}

SelectedAdvisoryDetail.propTypes = {
  advisory: PropTypes.object.isRequired,
  children: PropTypes.node,
  showAdvisoryType: PropTypes.bool,
  handleSelectAdvisory: PropTypes.func.isRequired,
  isAdvisorySelected: PropTypes.bool.isRequired
}
