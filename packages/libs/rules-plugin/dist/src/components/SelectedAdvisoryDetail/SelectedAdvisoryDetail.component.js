import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { airmapIntl } from 'libs/airmap-intl';
import { Collapse } from '@material-ui/core';
import { getDeviceTimeZone, getUrlWithHTTP } from '../../helpers/rules-plugin.helpers';
import { CalendarMonth } from 'modules/icons/components/CalendarMonth/CalendarMonth.component';
import { ChevronRight } from 'modules/icons/components/ChevronRight/ChevronRight.component';
import { Link } from 'modules/icons/components/Link/Link.component';
import { AdvisorySchedule } from '../AdvisorySchedule/AdvisorySchedule.component';
import { AdvisoryAlertIcon } from '../AdvisoryAlertIcon/AdvisoryAlertIcon.component';
import { getTimeFromAdvisory, getPhoneNumberFromAdvisory } from '../AdvisoryDetail/AdvisoryDetail.helpers';
import { SelectedAdvisoryDetailMessages } from './SelectedAdvisoryDetail.messages';
import { inactiveColor, detailWrapper, selectedAdvisory, detailContent, advisoryTitle, advisoryText, activeText, scheduleButtonWrapper, collapseScheduleButton, collapseIcon, collapseIconExpanded, offsetBanner, externalLink } from './SelectedAdvisoryDetail.styles.scss';
export const SelectedAdvisoryDetail = ({ advisory: { properties: { url, body, description, ...properties }, type, name, color, schedule, requirements, isActive, isActiveUnknown, ...advisoryData }, showAdvisoryType, handleSelectAdvisory, isAdvisorySelected }) => {
    const inactiveAdvisoryClass = !isActive && !isActiveUnknown ? inactiveColor : '';
    const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);
    const advisoryTime = getTimeFromAdvisory(properties);
    const shouldShowActiveLabel = isActive && advisoryTime && !schedule;
    const phoneNumber = getPhoneNumberFromAdvisory(requirements);
    const advisoryType = SelectedAdvisoryDetailMessages[`advisoryLabel_${type}`]
        ? airmapIntl.translateMessage(SelectedAdvisoryDetailMessages[`advisoryLabel_${type}`])
        : type;
    const deviceTimezone = getDeviceTimeZone();
    const hasTimeZoneDiffered = useMemo(() => {
        return schedule && deviceTimezone !== schedule[0].data.utc_offset;
    }, [schedule, deviceTimezone]);
    const toggleSchedule = useCallback(e => {
        e.stopPropagation();
        setIsScheduleExpanded(!isScheduleExpanded);
    }, [isScheduleExpanded]);
    const handleAdvisoryClick = useCallback(() => handleSelectAdvisory({ ...advisoryData, type }), [
        advisoryData,
        handleSelectAdvisory,
        type
    ]);
    return (_jsxs("div", { className: `${detailWrapper} ${isAdvisorySelected ? selectedAdvisory : ''}`, onClick: handleAdvisoryClick, children: [_jsx(AdvisoryAlertIcon, { color: color }, void 0), _jsxs("div", { className: detailContent, children: [showAdvisoryType && _jsx("h3", { className: `${advisoryTitle} ${inactiveAdvisoryClass}`, children: advisoryType }, void 0), _jsx("p", { className: `${advisoryText} ${inactiveAdvisoryClass}`, children: name || airmapIntl.translateMessage(SelectedAdvisoryDetailMessages.unknown) }, void 0), body && _jsx("p", { className: `${advisoryText} ${inactiveAdvisoryClass}`, children: body }, void 0), description && _jsx("p", { className: `${advisoryText} ${inactiveAdvisoryClass}`, children: description }, void 0), shouldShowActiveLabel && (_jsx("p", { className: `${advisoryText} ${activeText}`, children: airmapIntl.translateMessage(SelectedAdvisoryDetailMessages.active) }, void 0)), phoneNumber && _jsx("p", { className: `${advisoryText} ${inactiveAdvisoryClass}`, children: phoneNumber }, void 0), schedule && (_jsxs(_Fragment, { children: [_jsxs("div", { className: scheduleButtonWrapper, children: [_jsxs("button", { className: collapseScheduleButton, onClick: toggleSchedule, children: [_jsx(CalendarMonth, {}, void 0), airmapIntl.translateMessage(SelectedAdvisoryDetailMessages.schedule), _jsx(ChevronRight, { className: `${collapseIcon} ${isScheduleExpanded ? collapseIconExpanded : ''}` }, void 0)] }, void 0), isActive ? (_jsx("span", { className: activeText, children: airmapIntl.translateMessage(SelectedAdvisoryDetailMessages.active) }, void 0)) : (_jsx("span", { className: inactiveColor, children: airmapIntl.translateMessage(isActiveUnknown ? SelectedAdvisoryDetailMessages.unknown : SelectedAdvisoryDetailMessages.inactive) }, void 0))] }, void 0), _jsxs(Collapse, { in: isScheduleExpanded, children: [hasTimeZoneDiffered && (_jsxs("div", { className: offsetBanner, children: [_jsx(AdvisoryAlertIcon, {}, void 0), _jsx("span", { children: airmapIntl.translateMessage(SelectedAdvisoryDetailMessages.offsetBanner, {
                                                    deviceTimezone
                                                }) }, void 0)] }, void 0)), _jsx(AdvisorySchedule, { schedule: schedule, isAdvisoryActive: isActive || isActiveUnknown }, void 0)] }, void 0)] }, void 0))] }, void 0), url && (_jsx("a", { className: externalLink, href: getUrlWithHTTP(url), target: "_blank", rel: "noopener noreferrer", children: _jsx(Link, {}, void 0) }, void 0))] }, void 0));
};
SelectedAdvisoryDetail.defaultProps = {
    children: '',
    showAdvisoryType: true
};
SelectedAdvisoryDetail.propTypes = {
    advisory: PropTypes.object.isRequired,
    children: PropTypes.node,
    showAdvisoryType: PropTypes.bool,
    handleSelectAdvisory: PropTypes.func.isRequired,
    isAdvisorySelected: PropTypes.bool.isRequired
};
