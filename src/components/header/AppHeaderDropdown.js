import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react-pro'
import {
  cilAccountLogout,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import profile from './../../assets/images/avatars/profile.png'
import { useNavigate } from 'react-router-dom'
import { logout } from 'src/utils/auth'

const AppHeaderDropdown = () => {
  const { t } = useTranslation()
  const navigate = useNavigate(); 

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <CDropdown variant="nav-item" alignment="end">
      <CDropdownToggle className="py-0" caret={false}>
        <CAvatar src={profile} size="md"/>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0">
        <CDropdownHeader className="bg-body-secondary text-body-secondary fw-semibold rounded-top mb-2">
          {t('account')}
        </CDropdownHeader>
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilAccountLogout} className="me-2"/>
          {t('logout')}
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
