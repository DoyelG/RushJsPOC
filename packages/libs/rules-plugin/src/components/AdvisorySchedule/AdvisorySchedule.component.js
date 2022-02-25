import React from 'react'
import PropTypes from 'prop-types'

import { formatMonthDayDate } from 'modules/core/helpers/date-time.helpers'
import { AdvisoryTimesheetItem } from '../AdvisoryTimesheetItem/AdvisoryTimesheetItem.component'
import { groupAndSortTimesheets } from './AdvisorySchedule.helpers'
import { scheduleWrapper, scheduleDateRange } from './AdvisorySchedule.styles.scss'

export const AdvisorySchedule = ({ schedule, isAdvisoryActive }) => {
  const scheduleParsed = groupAndSortTimesheets(schedule)

  return Object.keys(scheduleParsed).map(scheduleObjectKey => (
    <ul key={scheduleObjectKey} className={scheduleWrapper}>
      <li className={scheduleDateRange}>
        {formatMonthDayDate(scheduleParsed[scheduleObjectKey].start, scheduleParsed[scheduleObjectKey].end)}
      </li>
      {Object.keys(scheduleParsed[scheduleObjectKey].days).map(scheduleDay => (
        <AdvisoryTimesheetItem
          key={scheduleDay}
          isAdvisoryActive={isAdvisoryActive}
          {...scheduleParsed[scheduleObjectKey].days[scheduleDay]}
        />
      ))}
    </ul>
  ))
}

AdvisorySchedule.propTypes = {
  schedule: PropTypes.array.isRequired,
  isAdvisoryActive: PropTypes.bool.isRequired
}
