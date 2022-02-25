import moment from 'moment'
import { format, parse, isValidNumber } from 'libphonenumber-js'

export const getTimeFromAdvisory = ({ date_effective, effective_start, effective_end }) => {
  const date = date_effective || effective_end || effective_start

  if (date) {
    return moment(date)
  }
}

export const getPhoneNumberFromAdvisory = requirements => {
  const phoneNumber = requirements && requirements.notice && requirements.notice.phone

  if (phoneNumber) {
    const parsedNumber = parse(phoneNumber)

    if (isValidNumber(parsedNumber)) {
      return format(parsedNumber, 'International')
    }
  }
}
