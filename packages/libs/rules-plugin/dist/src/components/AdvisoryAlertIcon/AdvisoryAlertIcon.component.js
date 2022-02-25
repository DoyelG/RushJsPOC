import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styles, { alertIconWrapper } from './AdvisoryAlertIcon.styles.scss';
import { Alert } from 'modules/icons/components/Alert/Alert.component';
export const AdvisoryAlertIcon = ({ color, className }) => {
    return (_jsx("span", { className: `${alertIconWrapper} ${color ? styles[`alert-icon_${color}`] : ''} ${className}`, children: _jsx(Alert, {}, void 0) }, void 0));
};
AdvisoryAlertIcon.defaultProps = {
    color: '',
    className: ''
};
AdvisoryAlertIcon.propTypes = {
    color: PropTypes.string,
    className: PropTypes.string
};
