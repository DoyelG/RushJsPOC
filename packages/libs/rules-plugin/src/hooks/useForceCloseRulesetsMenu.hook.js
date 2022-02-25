import { useEffect } from 'react'
import { CLOSE_RULES_MENU } from '../constants/rules-plugin.constants'

export const useForceCloseRulesetsMenu = callback => {
  useEffect(
    function useForceCloseRulesetsMenuCalls() {
      const handleRefreshUI = () => {
        if (callback) {
          callback()
        }
      }
      window.addEventListener(CLOSE_RULES_MENU, handleRefreshUI)
      return () => {
        window.removeEventListener(CLOSE_RULES_MENU, handleRefreshUI)
      }
    },
    [callback]
  )
}
