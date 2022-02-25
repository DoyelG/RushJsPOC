import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { formatTimesheetToTime } from 'modules/core/helpers/date-time.helpers';
import { timestampFormatting } from '../../constants/rules-plugin.constants';
import { wrapper, active, inactiveAdvisory } from './AdvisoryTimesheetItem.styles.scss';
export const AdvisoryTimesheetItem = ({ timesheets, day, isAdvisoryActive }) => {
    const isActive = timesheets.some(timesheet => timesheet.active);
    return (_jsxs("li", { className: `${wrapper} ${isActive ? active : ''} ${!isAdvisoryActive ? inactiveAdvisory : ''}`, children: [_jsx("span", { children: day.name }, void 0), _jsx("div", { children: timesheets
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
                        : timesheet.start.date.format(timestampFormatting.TIME_AM_PM);
                    const endTime = timesheet.end.event
                        ? timesheet.end.event.name
                        : timesheet.end.date.format(timestampFormatting.TIME_AM_PM_TZ);
                    return (_jsx("div", { className: `${timesheet.active ? active : ''}`, children: `${startTime} - ${endTime} ${timesheet.offset !== 0 ? timesheet.offset : ''}` }, index));
                }) }, void 0)] }, void 0));
};
AdvisoryTimesheetItem.propTypes = {
    timesheets: PropTypes.array.isRequired,
    day: PropTypes.object.isRequired,
    isAdvisoryActive: PropTypes.bool.isRequired
};
