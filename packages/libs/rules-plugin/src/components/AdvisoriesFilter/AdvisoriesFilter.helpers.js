import moment from 'moment'
import mtz from 'moment-timezone'
import { timestampFormatting } from 'modules/core/constants/date-time.constants'
import { getDeviceTimeZone } from 'modules/core/helpers/date-time.helpers'

export const formatDateTimeValue = (date, time) => {
  const isTimeOnANewDay = moment(time).isAfter(date)

  const dateString = moment(isTimeOnANewDay ? time : date).format(timestampFormatting.DATE)
  const timeString = time.format(timestampFormatting.LOCALE_TIME)

  return moment(
    `${dateString} ${timeString}`,
    `${timestampFormatting.DATE} ${timestampFormatting.LOCALE_TIME}`
  ).toISOString()
}

export const formatAppliedFilterValue = ({ start, end }) => {
  const { date: startDate, time: startTime } = formatByTimezone(start)
  const { date: endDate, time: endTime } = formatByTimezone(end)
  const timezone = getDeviceTimeZone()
  const areSameDay = moment(start).isSame(moment(end), 'day')

  if (areSameDay) {
    return `${startDate}, ${startTime} ${timezone} - ${endTime} ${timezone}`
  }

  return `${startDate} ${startTime} ${timezone} - ${endDate} ${endTime} ${timezone}`
}

const formatByTimezone = date => {
  const timezone = mtz.tz.zone(moment.tz.guess(true))
  const tzDate = moment.tz(date, timezone.name)
  const clientDate = tzDate.format(timestampFormatting.LOCALE_DATE)
  const clientTime = tzDate.format(timestampFormatting.LOCALE_TIME)

  return {
    date: clientDate,
    time: clientTime
  }
}
