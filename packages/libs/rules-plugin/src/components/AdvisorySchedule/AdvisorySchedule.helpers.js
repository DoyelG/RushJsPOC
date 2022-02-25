import { daySorting } from './AdvisorySchedule.constants'

export const groupAndSortTimesheets = schedule => {
  const groupedTimesheets = groupTimesheetsByDay(schedule)

  const sortedRangeKeys = Object.keys(groupedTimesheets).sort((a, b) => {
    const firstElement = groupedTimesheets[a].start
    const secondElement = groupedTimesheets[b].start
    return firstElement.month !== secondElement.month
      ? firstElement.month - secondElement.month
      : firstElement.day - secondElement.day
  })

  return sortedRangeKeys.reduce((sortedRanges, key) => {
    sortedRanges[key] = { ...groupedTimesheets[key] }
    sortedRanges[key].days = sortDays(sortedRanges[key].days)
    return sortedRanges
  }, {})
}

const groupTimesheetsByDay = schedule => {
  return schedule.reduce((parsedSchedule, timesheet) => {
    const timesheetStart = timesheet.data.start.date
    const timesheetEnd = timesheet.data.end.date

    const rangeStart = `${timesheetStart.month}/${timesheetStart.day}`
    const rangeEnd = `${timesheetEnd.month}/${timesheetEnd.day}`
    const rangeId = `${rangeStart}_${rangeEnd}`

    if (!parsedSchedule[rangeId]) {
      parsedSchedule[rangeId] = {
        start: timesheetStart,
        end: timesheetEnd,
        days: {}
      }
    }

    const timesheetDay = timesheet.data.day

    if (!parsedSchedule[rangeId].days[timesheetDay.id]) {
      parsedSchedule[rangeId].days[timesheetDay.id] = {
        day: { ...timesheetDay },
        timesheets: []
      }
    }

    parsedSchedule[rangeId].days[timesheetDay.id].timesheets.push(timesheet)

    return parsedSchedule
  }, {})
}

const sortDays = days => {
  const sortedTimesheetsKeys = Object.keys(days).sort((a, b) => {
    return daySorting.indexOf(a) - daySorting.indexOf(b)
  })

  return sortedTimesheetsKeys.reduce((sortedTimesheets, key) => {
    sortedTimesheets[key] = days[key]
    return sortedTimesheets
  }, {})
}
