import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBuilding,
  cilGrid,
  cilHome,
  cilLayers,
  cilList,
  cilSpeedometer,
  cilBriefcase,
  cilDoor,
  cilApps,
  cilBank,
  cilIndustry,
  cilUser,
  cilSpreadsheet
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react-pro'
import { Translation } from 'react-i18next'

const _nav = [
  {
    component: CNavItem,
    name: <Translation>{(t) => t('dashboard')}</Translation>,
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: <Translation>{(t) => t('property')}</Translation>,
  },
  {
    component: CNavGroup,
    name: <Translation>{(t) => t('Property')}</Translation>,
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add Property',
        to: '/property/add-property',
      },
      {
        component: CNavItem,
        name: 'Property List',
        to: '/property/property-list',
      },
      {
        component: CNavGroup,
        name: <Translation>{(t) => t('Gates')}</Translation>,
        to: '/gates',
        icon: <CIcon icon={cilDoor} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Add Gate',
            to: '/gates/add-gate',
          },
          {
            component: CNavItem,
            name: 'Gates List',
            to: '/gates/gates-list',
          }
        ],
      },
      {
        component: CNavGroup,
        name: <Translation>{(t) => t('Property Assets')}</Translation>,
        to: '/property-assets',
        icon: <CIcon icon={cilBriefcase} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Add Assets',
            to: '/property-assets/add-assets',
          },
          {
            component: CNavItem,
            name: 'Assets List',
            to: '/property-assets/assets-list',
          }
        ],
      },
      {
        component: CNavGroup,
        name: <Translation>{(t) => t('Sectors')}</Translation>,
        to: '/sectors',
        icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Add Sector',
            to: '/sectors/add-sector',
          },
          {
            component: CNavItem,
            name: 'Sectors List',
            to: '/sectors/sectors-list',
          }
        ],
      },
      {
        component: CNavGroup,
        name: <Translation>{(t) => t('Blocks')}</Translation>,
        to: '/blocks',
        icon: <CIcon icon={cilGrid} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Add Blocks',
            to: '/blocks/add-block',
          },
          {
            component: CNavItem,
            name: 'Blocks List',
            to: '/blocks/blocks-list',
          }
        ],
      },
      {
        component: CNavGroup,
        name: <Translation>{(t) => t('Units')}</Translation>,
        to: '/units',
        icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Add Unit',
            to: '/units/add-unit',
          },
          {
            component: CNavItem,
            name: 'Units List',
            to: '/units/units-list',
          }
        ],
      },
      {
        component: CNavGroup,
        name: <Translation>{(t) => t('Amenities')}</Translation>,
        to: '/amenity',
        icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Add Amenity',
            to: '/amenity/add-amenity',
          },
          {
            component: CNavItem,
            name: 'Amenity List',
            to: '/amenity/amenity-list',
          }
        ],
      },
      {
        component: CNavGroup,
        name: <Translation>{(t) => t('Bank Details')}</Translation>,
        to: '/bank-details',
        icon: <CIcon icon={cilBank} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Bank Details',
            to: '/bank-details/add-bank',
          },
          {
            component: CNavItem,
            name: 'Bank List',
            to: '/bank-details/bank-list',
          }
        ],
      },
      {
        component: CNavGroup,
        name: <Translation>{(t) => t('Office')}</Translation>,
        to: '/office-details',
        icon: <CIcon icon={cilIndustry} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Office Details',
            to: '/office-details/add-office',
          },
          {
            component: CNavItem,
            name: 'Office List',
            to: '/office-details/office-list',
          }
        ],
      },
    ],
  },

  {
    component: CNavTitle,
    name: <Translation>{(t) => t('components')}</Translation>,
  },
  {
    component: CNavGroup,
    name: <Translation>{(t) => t('Amenity Master')}</Translation>,
    to: '/amenity-master',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add Amenity Master',
        to: '/amenity-masters/add-amenity-master',
      },
      {
        component: CNavItem,
        name: 'Amenity Masters List',
        to: '/amenity-masters/amenity-masters-list',
      }
    ],
  },
  
  {
    component: CNavGroup,
    name: <Translation>{(t) => t('Application Module')}</Translation>,
    to: '/application-module',
    icon: <CIcon icon={cilApps} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add Module',
        to: '/application-module/add-module',
      },
      {
        component: CNavItem,
        name: 'Module List',
        to: '/application-module/module-list',
      }
    ],
  },
  
  {
    component: CNavTitle,
    name: <Translation>{(t) => t('Users')}</Translation>,
  },
  {
    component: CNavItem,
    name: <Translation>{(t) => t('Add Users')}</Translation>,
    to: '/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: <Translation>{(t) => t('User Property')}</Translation>,
    to: '/user-property',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: <Translation>{(t) => t('Property Unit')}</Translation>,
    to: '/user-property-unit',
    icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
  },
  
  {
    component: CNavTitle,
    name: <Translation>{(t) => t('Import')}</Translation>,
  },
  {
    component: CNavItem,
    name: <Translation>{(t) => t('Import Excel')}</Translation>,
    to: '/import-excel',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
  },

]



export default _nav
