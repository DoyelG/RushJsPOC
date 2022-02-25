import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { airmapIntl } from 'libs/airmap-intl';
import { getTimeFromAdvisory, getPhoneNumberFromAdvisory } from './AdvisoryDetail.helpers';
import { AdvisoryDetailMessages } from './AdvisoryDetail.messages';
import { inactiveColor, detailWrapper, selectedAdvisory, detailContent, advisoryTitle, advisoryText, activeText, warnings, warningPill, scheduleButtonWrapper, collapseScheduleButton, collapseIcon, collapseIconExpanded, offsetBanner } from './AdvisoryDetail.styles.scss';
import { advisoriesColorTypes, advisoryColors } from '../../constants/rules-plugin.constants';
import { getDeviceTimeZone } from 'modules/rules-plugin/helpers/rules-plugin.helpers';
import { AdvisorySchedule } from '../AdvisorySchedule/AdvisorySchedule.component';
import { AdvisoryAlertIcon } from '../AdvisoryAlertIcon/AdvisoryAlertIcon.component';
import { Collapse } from '@material-ui/core';
import { CalendarMonth } from 'modules/icons/components/CalendarMonth/CalendarMonth.component';
import { ChevronRight } from 'modules/icons/components/ChevronRight/ChevronRight.component';
export const AdvisoryDetail = ({ advisory: { properties: { body, description, ...properties }, type, name, color, schedule, requirements, isActive, isActiveUnknown, counter, ...advisoryData }, showAdvisoryType, handleSelectAdvisory, isAdvisorySelected }) => {
    const isYellowColorType = color === advisoriesColorTypes.YELLOW;
    const inactiveAdvisoryClass = !isActive && !isActiveUnknown ? inactiveColor : '';
    const advisoryTime = getTimeFromAdvisory(properties);
    const shouldShowActiveLabel = isActive && advisoryTime && !schedule;
    const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);
    const phoneNumber = getPhoneNumberFromAdvisory(requirements);
    const advisoryType = AdvisoryDetailMessages[`advisoryLabel_${type}`]
        ? airmapIntl.translateMessage(AdvisoryDetailMessages[`advisoryLabel_${type}`])
        : type;
    const handleAdvisoryClick = useCallback(() => handleSelectAdvisory({ ...advisoryData, type }), [
        advisoryData,
        handleSelectAdvisory,
        type
    ]);
    const deviceTimezone = getDeviceTimeZone();
    const hasTimeZoneDiffered = useMemo(() => {
        return schedule && deviceTimezone !== schedule[0].data.utc_offset;
    }, [schedule, deviceTimezone]);
    const onScheduleButtonClick = event => {
        event.stopPropagation();
        setIsScheduleExpanded(!isScheduleExpanded);
    };
    return (_jsxs("div", { className: `${detailWrapper} ${isAdvisorySelected ? selectedAdvisory : ''}`, onClick: handleAdvisoryClick, children: [_jsx("div", { className: warnings, children: _jsx("span", { className: warningPill, style: { backgroundColor: color, color: isYellowColorType ? advisoryColors.navy : advisoryColors.white }, children: counter }, void 0) }, void 0), _jsxs("div", { className: detailContent, children: [showAdvisoryType && _jsx("h3", { className: `${advisoryTitle} ${inactiveAdvisoryClass}`, children: advisoryType }, void 0), _jsx("p", { className: `${advisoryText} ${inactiveAdvisoryClass}`, children: name || airmapIntl.translateMessage(AdvisoryDetailMessages.unknown) }, void 0), body && _jsx("p", { className: `${advisoryText} ${inactiveAdvisoryClass}`, children: body }, void 0), description && _jsx("p", { className: `${advisoryText} ${inactiveAdvisoryClass}`, children: description }, void 0), shouldShowActiveLabel && (_jsx("p", { className: `${advisoryText} ${activeText}`, children: airmapIntl.translateMessage(AdvisoryDetailMessages.active) }, void 0)), phoneNumber && _jsx("p", { className: `${advisoryText} ${inactiveAdvisoryClass}`, children: phoneNumber }, void 0), schedule && (_jsxs(_Fragment, { children: [_jsxs("div", { className: scheduleButtonWrapper, children: [_jsxs("button", { className: collapseScheduleButton, onClick: onScheduleButtonClick, children: [_jsx(CalendarMonth, {}, void 0), airmapIntl.translateMessage(AdvisoryDetailMessages.schedule), _jsx(ChevronRight, { className: `${collapseIcon} ${isScheduleExpanded ? collapseIconExpanded : ''}` }, void 0)] }, void 0), _jsx("span", { className: activeText, children: airmapIntl.translateMessage(AdvisoryDetailMessages.active) }, void 0)] }, void 0), _jsxs(Collapse, { in: isScheduleExpanded, children: [hasTimeZoneDiffered && (_jsxs("div", { className: offsetBanner, children: [_jsx(AdvisoryAlertIcon, {}, void 0), _jsx("span", { children: airmapIntl.translateMessage(AdvisoryDetailMessages.offsetBanner, {
                                                    deviceTimezone
                                                }) }, void 0)] }, void 0)), _jsx(AdvisorySchedule, { schedule: schedule, isAdvisoryActive: true }, void 0)] }, void 0)] }, void 0))] }, void 0)] }, void 0));
};
AdvisoryDetail.defaultProps = {
    children: '',
    showAdvisoryType: true
};
AdvisoryDetail.propTypes = {
    advisory: PropTypes.object.isRequired,
    children: PropTypes.node,
    showAdvisoryType: PropTypes.bool,
    handleSelectAdvisory: PropTypes.func.isRequired,
    isAdvisorySelected: PropTypes.bool.isRequired
};
