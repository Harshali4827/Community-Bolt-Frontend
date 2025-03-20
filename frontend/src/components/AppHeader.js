import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import {
  CContainer,
  CForm,
  CFormInput,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CInputGroup,
  CInputGroupText,
  useColorModes,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import {
  cilContrast,
  cilApplicationsSettings,
  cilMenu,
  cilMoon,
  cilSearch,
  cilSun,
  cilLanguage,
  cifGb,
  cifEs,
  cifPl,
} from '@coreui/icons'

import {
  AppHeaderDropdown,
  AppHeaderDropdownMssg,
  AppHeaderDropdownNotif,
  AppHeaderDropdownTasks,
} from './header/index'

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-pro-react-admin-template-theme-bright')
  const { i18n, t } = useTranslation()

  const dispatch = useDispatch()
  const asideShow = useSelector((state) => state.asideShow)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  return (
    <CHeader position="sticky" className="bg-primary mb-4 p-0" ref={headerRef}>
      <CContainer className="px-4" fluid>
        <CHeaderToggler
          className={classNames('d-lg-none', {
            'prevent-hide': !sidebarShow,
          })}
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CForm className="d-none d-sm-flex">
          <CInputGroup className="border border-light border-opacity-25 rounded">
            <CInputGroupText id="search-addon" className="bg-transparent border-0 px-1">
              <CIcon icon={cilSearch} size="lg" className="my-1 mx-2 text-white text-opacity-25" />
            </CInputGroupText>
            <CFormInput
              placeholder={t('search')}
              aria-label="Search"
              aria-describedby="search-addon"
              className="bg-transparent border-0"
            />
          </CInputGroup>
        </CForm>
        <CHeaderNav className="d-none d-md-flex ms-auto">
          <AppHeaderDropdownNotif />
          <AppHeaderDropdownTasks />
          <AppHeaderDropdownMssg />
        </CHeaderNav>
        <CHeaderNav className="ms-auto ms-md-0">
          <AppHeaderDropdown />
        </CHeaderNav>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', asideShow: !asideShow })}
          style={{ marginInlineEnd: '-12px' }}
        >
          <CIcon icon={cilApplicationsSettings} size="lg" />
        </CHeaderToggler>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
