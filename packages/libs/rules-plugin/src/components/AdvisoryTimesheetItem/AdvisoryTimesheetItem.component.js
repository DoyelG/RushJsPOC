import React from 'react'
import PropTypes from 'prop-types'

import { formatTimesheetToTime } from 'modules/core/helpers/date-time.helpers'
import { timestampFormatting } from '../../constants/rules-plugin.constants'
import { wrapper, active, inactiveAdvisory } from './AdvisoryTimesheetItem.styles.scss'

export const AdvisoryTimesheetItem = ({ timesheets, day, isAdvisoryActive }) => {
  const isActive = timesheets.some(timesheet => timesheet.active)

  return (
    <li className={`${wrapper} ${isActive ? active : ''} ${!isAdvisoryActive ? inactiveAdvisory : ''}`}>
      <span>{day.name}</span>
      <div>
        {timesheets
          .map(timesheet => ({
            start: {
              ...timesheet.data.start,
              date: formatTimesheetToTime(timesheet.data.start)
            },
            end: {
              ...timesheet.data.end,
              date: formatTimesheetToTime(timesheet.data.end)
            },
            offset: timesheet.data.utc_offset
          }))
          .sort((a, b) => (a.start.date.isBefore(b.start.date) ? -1 : a.start.date.isBefore(b.start.date) ? 1 : 0))
          .map((timesheet, index) => {
            const startTime = timesheet.start.event
              ? timesheet.start.event.name
              : timesheet.start.date.format(timestampFormatting.TIME_AM_PM)

            const endTime = timesheet.end.event
              ? timesheet.end.event.name
              : timesheet.end.date.format(timestampFormatting.TIME_AM_PM_TZ)

            return (
              <div key={index} className={`${timesheet.active ? active : ''}`}>{`${startTime} - ${endTime} ${
                timesheet.offset !== 0 ? timesheet.offset : ''
              }`}</div>
            )
          })}
      </div>
    </li>
  )
}

AdvisoryTimesheetItem.propTypes = {
  timesheets: PropTypes.array.isRequired,
  day: PropTypes.object.isRequired,
  isAdvisoryActive: PropTypes.bool.isRequired
}
