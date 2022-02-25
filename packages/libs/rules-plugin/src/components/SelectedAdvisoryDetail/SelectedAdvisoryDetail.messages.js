import { defineMessages } from 'react-intl'
import { WebAppCoreMessages } from 'projects/web-app/modules/core/core.messages'

export const SelectedAdvisoryDetailMessages = defineMessages({
  ...WebAppCoreMessages,
  unknown: {
    id: 'SelectedAdvisoryDetail.unknown',
    defaultMessage: 'Unknown'
  },
  active: {
    id: 'SelectedAdvisoryDetail.active',
    defaultMessage: 'Active'
  },
  inactive: {
    id: 'SelectedAdvisoryDetail.inactive',
    defaultMessage: 'Inactive'
  },
  offsetBanner: {
    id: 'SelectedAdvisoryDetail.offsetBanner',
    defaultMessage: 'Displayed times may differ from your device timezone ({deviceTimezone}).'
  },
  schedule: {
    id: 'SelectedAdvisoryDetail.schedule',
    defaultMessage: 'Schedule'
  }
})
