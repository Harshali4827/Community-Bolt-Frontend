import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  CSidebar
} from '@coreui/react-pro'
const AppAside = () => {
  const dispatch = useDispatch()
  const asideShow = useSelector((state) => state.asideShow)
  const { t } = useTranslation()

  const [activeKey, setActiveKey] = useState(1)

  return (
    <CSidebar
    >
     
    </CSidebar>
  )
}

export default React.memo(AppAside)
