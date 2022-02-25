import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Popover } from 'modules/shared-components/Popover/Popover.component';
import { Clock } from 'modules/icons/components/Clock/Clock.component';
import { Filter } from 'modules/icons/components/Filter/Filter.component';
import { Switch } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import { popoverBody, openButton, appliedFilterChip, chipActive, advisoriesFilterWrapper, title, showInactiveAdvisoriesWrapper, showInactiveAdvisoriesText, switchChecked, disclaimerWrapper, disclaimerTitle, disclaimerBody, footer, button, footerRight, divider } from './AdvisoriesFilter.styles.scss';
import { airmapIntl } from 'libs/airmap-intl';
import { AdvisoriesFilterMessages } from './AdvisoriesFilter.messages';
import { TimeRangeFilter } from 'modules/shared-components/TimeRangeFilter/TimeRangeFilter.component';
import { defaultTimeRangeFilterValues, predefinedRanges } from 'modules/shared-components/TimeRangeFilter/TimeRangeFilter.constants';
import { formatDateTimeValue, formatAppliedFilterValue } from './AdvisoriesFilter.helpers';
import { DatePicker } from 'modules/shared-components/DatePicker/DatePicker.component';
import { defaultDatePickerValue } from 'modules/shared-components/DatePicker/DatePicker.constants';
import moment from 'moment';
import { useManageMenusToggling } from '../../hooks/useManageMenusToggling.hook.js';
import { IconButton } from 'ui-styling/components/buttons/IconButton/IconButton.component';
import { RectangleButton } from 'ui-styling/components/buttons/RectangleButton/RectangleButton.component';
import { appliedAdvisoriesFilterStorageKey, shouldShowInactiveAdvisoriesStorageKey } from '../../constants/rules-plugin.constants';
export const AdvisoriesFilter = ({ getAdvisoriesFromVisibleRulesets, setAppliedAdvisoriesFilter, appliedAdvisoriesFilter, shouldShowInactiveAdvisories, showInactiveAdvisories, hideInactiveAdvisories, applyFilterToLayers }) => {
    const theme = useTheme();
    const [openPopover, setOpenPopover] = useState(false);
    const [timeFilterValue, setTimeFilterValue] = useState({ ...defaultTimeRangeFilterValues });
    const [dateFilterValue, setDateFilterValue] = useState(defaultDatePickerValue.clone());
    const [selectedPredefinedRange, setSelectedPredefinedRange] = useState(predefinedRanges.NEXT_4H);
    const [timeRangeErrorMessage, setTimeRangeErrorMessage] = useState('');
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [showInactiveAdvisoriesChecked, setShowInactiveAdvisoriesChecked] = useState(shouldShowInactiveAdvisories);
    const isTodaySelected = dateFilterValue.isSame(moment(), 'day');
    const advisoriesFilterButtonId = 'sel-button-advisories-filter-open';
    useManageMenusToggling(() => setOpenPopover(false), advisoriesFilterButtonId);
    const getFilterValueBasedOnSelectedValues = useCallback(() => {
        const timeRangeToApply = { ...timeFilterValue };
        if (selectedPredefinedRange !== predefinedRanges.CUSTOM) {
            timeRangeToApply.start = moment();
            timeRangeToApply.end = moment().add(selectedPredefinedRange, 'hours');
        }
        return {
            start: formatDateTimeValue(dateFilterValue, timeRangeToApply.start),
            end: formatDateTimeValue(dateFilterValue, timeRangeToApply.end)
        };
    }, [dateFilterValue, selectedPredefinedRange, timeFilterValue]);
    const toggleShowInactiveAdvisories = useCallback(() => {
        setShowInactiveAdvisoriesChecked(state => !state);
    }, []);
    const handleResetValues = useCallback(() => {
        setTimeFilterValue({ ...defaultTimeRangeFilterValues });
        setDateFilterValue(defaultDatePickerValue.clone());
        setSelectedPredefinedRange(predefinedRanges.NEXT_4H);
        setHasUserInteracted(false);
    }, []);
    const handleApplyValues = useCallback(() => {
        const isValidToApply = selectedPredefinedRange !== predefinedRanges.CUSTOM || !timeRangeErrorMessage;
        if (isValidToApply) {
            const filterValue = getFilterValueBasedOnSelectedValues();
            const appliedAdvisoriesFilter = {
                ...filterValue,
                formattedValue: formatAppliedFilterValue(filterValue)
            };
            setAppliedAdvisoriesFilter(appliedAdvisoriesFilter);
            try {
                localStorage.setItem(appliedAdvisoriesFilterStorageKey, JSON.stringify(appliedAdvisoriesFilter));
            }
            catch (error) {
                console.warn(error);
            }
            if (showInactiveAdvisoriesChecked) {
                showInactiveAdvisories();
            }
            else {
                hideInactiveAdvisories();
            }
            localStorage.setItem(shouldShowInactiveAdvisoriesStorageKey, showInactiveAdvisoriesChecked);
            getAdvisoriesFromVisibleRulesets();
            applyFilterToLayers({
                timeRange: filterValue,
                showInactiveAdvisories: showInactiveAdvisoriesChecked
            });
            setOpenPopover(!openPopover);
        }
        setHasUserInteracted(true);
    }, [
        selectedPredefinedRange,
        timeRangeErrorMessage,
        showInactiveAdvisoriesChecked,
        getFilterValueBasedOnSelectedValues,
        setAppliedAdvisoriesFilter,
        getAdvisoriesFromVisibleRulesets,
        applyFilterToLayers,
        setOpenPopover,
        openPopover,
        showInactiveAdvisories,
        hideInactiveAdvisories
    ]);
    const handleChangeCustomRange = useCallback(value => {
        setTimeFilterValue(value);
        setHasUserInteracted(true);
    }, []);
    useEffect(function initTheAppliedAdvisoriesFilter() {
        if (!appliedAdvisoriesFilter.formattedValue) {
            const filterValue = getFilterValueBasedOnSelectedValues();
            setAppliedAdvisoriesFilter({
                ...filterValue,
                formattedValue: formatAppliedFilterValue(filterValue)
            });
        }
    }, [
        appliedAdvisoriesFilter,
        dateFilterValue,
        getFilterValueBasedOnSelectedValues,
        selectedPredefinedRange,
        setAppliedAdvisoriesFilter,
        timeFilterValue
    ]);
    useEffect(function setPredefinedRangeBasedOnDate() {
        if (!isTodaySelected) {
            setSelectedPredefinedRange(predefinedRanges.CUSTOM);
        }
    }, [dateFilterValue, isTodaySelected]);
    useEffect(function validateTimeRangeValues() {
        const now = moment();
        const isStartTimeValid = !isTodaySelected || timeFilterValue.start.isSameOrAfter(now);
        const isEndTimeValid = !isTodaySelected || timeFilterValue.end.isSameOrAfter(timeFilterValue.start);
        if (!isStartTimeValid) {
            setTimeRangeErrorMessage('errorMessageStartTime');
        }
        else if (!isEndTimeValid) {
            setTimeRangeErrorMessage('errorMessageEndTime');
        }
        else {
            setTimeRangeErrorMessage('');
        }
    }, [isTodaySelected, timeFilterValue]);
    useEffect(function setSwitchValueBasedOnStore() {
        setShowInactiveAdvisoriesChecked(shouldShowInactiveAdvisories);
    }, [shouldShowInactiveAdvisories]);
    return (_jsx(Popover, { open: openPopover, handleOnClose: () => setOpenPopover(false), classNameBody: popoverBody, openElement: _jsx("div", { className: "toggleable-menu", onMouseDown: event => {
                setOpenPopover(!openPopover);
                event.stopPropagation();
            }, id: advisoriesFilterButtonId, children: _jsx(IconButton, { id: "filter-advisories-menu-icon", className: openButton, onClick: () => { }, icon: _jsxs(_Fragment, { children: [_jsxs("div", { className: `${appliedFilterChip} ${openPopover ? chipActive : ''}`, children: [_jsx(Clock, {}, void 0), _jsx("span", { children: appliedAdvisoriesFilter.formattedValue }, void 0)] }, void 0), _jsx(Filter, { color: openPopover ? theme.palette.primary.main : theme.rulesPlugin.neutral3_opacity_05 }, void 0)] }, void 0) }, void 0) }, void 0), content: _jsxs("div", { className: advisoriesFilterWrapper, id: `sel-wrapper-advisories-filter`, children: [_jsx("h2", { className: title, children: airmapIntl.translateMessage(AdvisoriesFilterMessages.filterAdvisoriesTitle) }, void 0), _jsx(DatePicker, { id: "advisories-filter", value: dateFilterValue, handleOnChange: setDateFilterValue }, void 0), _jsx(TimeRangeFilter, { id: "advisories-filter", value: timeFilterValue, handleChangeCustomRange: handleChangeCustomRange, handleChangePredefinedRange: setSelectedPredefinedRange, selectedPredefinedRange: selectedPredefinedRange, isTodaySelected: isTodaySelected, errorMessage: timeRangeErrorMessage, hasUserInteracted: hasUserInteracted }, void 0), _jsx("hr", { className: divider }, void 0), _jsxs("div", { className: showInactiveAdvisoriesWrapper, children: [_jsx("label", { className: showInactiveAdvisoriesText, htmlFor: "toggle-inactive-advisories", children: airmapIntl.translateMessage(AdvisoriesFilterMessages.showInactiveAdvisories) }, void 0), _jsx(Switch, { id: "toggle-inactive-advisories", checked: showInactiveAdvisoriesChecked, onChange: toggleShowInactiveAdvisories, color: "primary", classes: { iconChecked: switchChecked } }, void 0)] }, void 0), _jsx("hr", { className: divider }, void 0), _jsxs("div", { className: disclaimerWrapper, children: [_jsx("h3", { className: disclaimerTitle, children: airmapIntl.translateMessage(AdvisoriesFilterMessages.disclaimer) }, void 0), _jsx("p", { className: disclaimerBody, children: airmapIntl.translateMessage(AdvisoriesFilterMessages.disclaimerBody) }, void 0)] }, void 0)] }, void 0), footer: _jsxs("div", { className: footer, children: [_jsx(RectangleButton, { id: `sel-button-advisories-filter-reset`, onClick: handleResetValues, className: button, variant: "secondary", size: "small", buttonText: airmapIntl.translateMessage(AdvisoriesFilterMessages.reset) }, void 0), _jsxs("div", { className: footerRight, children: [_jsx(RectangleButton, { id: `sel-button-advisories-filter-close`, onClick: () => setOpenPopover(false), className: button, variant: "secondary", size: "small", buttonText: airmapIntl.translateMessage(AdvisoriesFilterMessages.close) }, void 0), _jsx(RectangleButton, { id: `sel-button-advisories-filter-apply`, variant: "primary", size: "small", onClick: handleApplyValues, className: button, buttonText: airmapIntl.translateMessage(AdvisoriesFilterMessages.apply) }, void 0)] }, void 0)] }, void 0) }, void 0));
};
AdvisoriesFilter.propTypes = {
    getAdvisoriesFromVisibleRulesets: PropTypes.func.isRequired,
    setAppliedAdvisoriesFilter: PropTypes.func.isRequired,
    appliedAdvisoriesFilter: PropTypes.shape({
        formattedValue: PropTypes.string.isRequired,
        start: PropTypes.string.isRequired,
        end: PropTypes.string.isRequired
    }).isRequired,
    shouldShowInactiveAdvisories: PropTypes.bool.isRequired,
    showInactiveAdvisories: PropTypes.func.isRequired,
    hideInactiveAdvisories: PropTypes.func.isRequired,
    applyFilterToLayers: PropTypes.func.isRequired
};
