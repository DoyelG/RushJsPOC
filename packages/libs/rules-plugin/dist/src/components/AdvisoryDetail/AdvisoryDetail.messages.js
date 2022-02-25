import { defineMessages } from 'react-intl';
import { WebAppCoreMessages } from 'projects/web-app/modules/core/core.messages';
export const AdvisoryDetailMessages = defineMessages({
    ...WebAppCoreMessages,
    unknown: {
        id: 'AdvisoryDetail.unknown',
        defaultMessage: 'Unknown'
    },
    offsetBanner: {
        id: 'AdvisoryDetail.offsetBanner',
        defaultMessage: 'Displayed times may differ from your device timezone ({deviceTimezone}).'
    },
    schedule: {
        id: 'AdvisoryDetail.schedule',
        defaultMessage: 'Schedule'
    },
    active: {
        id: 'AdvisoryDetail.active',
        defaultMessage: 'Active'
    }
});
