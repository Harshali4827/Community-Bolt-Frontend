import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  CDropdown

} from '@coreui/react-pro'



const AppHeaderDropdownMssg = () => {
  const { t } = useTranslation()
  const itemsCount = 4
  return (
    <CDropdown variant="nav-item" alignment="end">
    </CDropdown>
  )
}

export default AppHeaderDropdownMssg
