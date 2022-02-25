import { useEffect, useState } from 'react';
export const useMemoiseCalls = (callback, params) => {
    const [oldParams, setOldParams] = useState('');
    useEffect(function verifyMemoisedValues() {
        const paramsStringify = JSON.stringify(params);
        if (oldParams != paramsStringify) {
            callback();
            setOldParams(paramsStringify);
        }
    }, [params, callback, oldParams]);
};
