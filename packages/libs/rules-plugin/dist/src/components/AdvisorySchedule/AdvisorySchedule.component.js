import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { formatMonthDayDate } from 'modules/core/helpers/date-time.helpers';
import { AdvisoryTimesheetItem } from '../AdvisoryTimesheetItem/AdvisoryTimesheetItem.component';
import { groupAndSortTimesheets } from './AdvisorySchedule.helpers';
import { scheduleWrapper, scheduleDateRange } from './AdvisorySchedule.styles.scss';
export const AdvisorySchedule = ({ schedule, isAdvisoryActive }) => {
    const scheduleParsed = groupAndSortTimesheets(schedule);
    return Object.keys(scheduleParsed).map(scheduleObjectKey => (_jsxs("ul", { className: scheduleWrapper, children: [_jsx("li", { className: scheduleDateRange, children: formatMonthDayDate(scheduleParsed[scheduleObjectKey].start, scheduleParsed[scheduleObjectKey].end) }, void 0), Object.keys(scheduleParsed[scheduleObjectKey].days).map(scheduleDay => (_jsx(AdvisoryTimesheetItem, { isAdvisoryActive: isAdvisoryActive, ...scheduleParsed[scheduleObjectKey].days[scheduleDay] }, scheduleDay)))] }, scheduleObjectKey)));
};
AdvisorySchedule.propTypes = {
    schedule: PropTypes.array.isRequired,
    isAdvisoryActive: PropTypes.bool.isRequired
};
