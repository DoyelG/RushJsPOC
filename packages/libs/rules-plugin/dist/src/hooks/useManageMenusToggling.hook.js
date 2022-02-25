import { useEffect, useCallback } from 'react';
export const useManageMenusToggling = (setMenuState, menuButtonId) => {
    const toggleMenu = useCallback(event => {
        const hasBeenDispatchedByComponent = event.currentTarget.id === menuButtonId;
        if (!hasBeenDispatchedByComponent) {
            setMenuState();
        }
    }, [setMenuState, menuButtonId]);
    useEffect(() => {
        const menuButtons = document.getElementsByClassName('toggleable-menu');
        Array.from(menuButtons).forEach(button => {
            button.addEventListener('click', toggleMenu);
        });
        return function () {
            Array.from(menuButtons).forEach(button => {
                button.removeEventListener('click', toggleMenu);
            });
        };
    }, [toggleMenu]);
};
