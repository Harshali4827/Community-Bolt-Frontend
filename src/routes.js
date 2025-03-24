
import React from 'react'
import { Translation } from 'react-i18next'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const AddGate = React.lazy(() => import('./views/gates/add-gate/AddGate'))
const GateList = React.lazy(() => import('./views/gates/gate-list/GateList'))
const UpdateGate = React.lazy(() => import('./views/gates/update-gate/UpdateGate'))

const AddProperty  = React.lazy(() => import('./views/property/add-property/AddProperty'))
const PropertyList = React.lazy(() => import('./views/property/property-list/PropertyList'))

const AddAssets  = React.lazy(() => import('./views/property-assets/add-assets/AddAssets'))
const AssetsList  = React.lazy(() => import('./views/property-assets/assets-list/AssetsList'))
const UpdateAssets = React.lazy(() => import('./views/property-assets/update-assets/UpdateAssets'))

const AddSector  = React.lazy(() => import('./views/sectors/add-sector/AddSector'))
const SectorsList = React.lazy(() => import('./views/sectors/sectors-list/SectorsList'))
const UpdateSector = React.lazy(() => import('./views/sectors/update-sector/UpdateSector'))

const AddBlock = React.lazy(() => import('./views/blocks/add-block/AddBlock'))
const BlocksList = React.lazy(() => import('./views/blocks/blocks-list/BlocksList'))
const UpdateBlock = React.lazy(() => import('./views/blocks/update-block/UpdateBlock'))

const AddUnit = React.lazy(() => import('./views/units/add-unit/AddUnit'))
const UnitsList = React.lazy(() => import('./views/units/units-list/UnitsList'))
const UpdateUnit = React.lazy(() => import('./views/units/update-unit/UpdateUnit'))

const AddMaster = React.lazy(() => import('./views/amenity-masters/add-master/AddMaster'))
const MastersList = React.lazy(() => import('./views/amenity-masters/masters-list/MastersList'))
const UpdateMaster = React.lazy(() => import('./views/amenity-masters/update-master/UpdateMaster'))

const AddAmenity = React.lazy(() => import('./views/amenities/add-amenities/AddAmenity'))
const AmenityList = React.lazy(() => import('./views/amenities/amenities-list/AmenityList'))
const UpdateAmenity = React.lazy(() => import('./views/amenities/update-amenity/UpdateAmenity'))

const AddModule = React.lazy(() => import('./views/application-module/add-module/AddModule'))
const ModuleList = React.lazy(() => import('./views/application-module/module-list/ModuleList'))
const UpdateModule = React.lazy(() => import('./views/application-module/update-module/UpdateModule'))

const AddBank = React.lazy(() => import('./views/bank-details/add-bank/AddBank'))
const BankList = React.lazy(() => import('./views/bank-details/bank-list/BankList'))
const UpdateBank = React.lazy(() => import('./views/bank-details/update-bank/UpdateBank'))

const AddOffice = React.lazy(() => import('./views/office-details/add-office/AddOffice'))
const OfficeList = React.lazy(() => import('./views/office-details/office-list/OfficeList'))
const UpdateOffice = React.lazy(() => import('./views/office-details/update-office/UpdateOffice'))

// Plugins
const Calendar = React.lazy(() => import('./views/plugins/calendar/Calendar'))
const Charts = React.lazy(() => import('./views/plugins/charts/Charts'))
const GoogleMaps = React.lazy(() => import('./views/plugins/google-maps/GoogleMaps'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const Invoice = React.lazy(() => import('./views/apps/invoicing/Invoice'))

const routes = [
  { path: '/', exact: true, name: <Translation>{(t) => t('home')}</Translation> },
  {
    path: '/dashboard',
    name: <Translation>{(t) => t('dashboard')}</Translation>,
    element: Dashboard,
  },
  {
    path: '/property',
    name: <Translation>{(t) => t('property')}</Translation>,
    exact: true,
  },
  { path: '/property/add-property', name: 'Add Property', element: AddProperty },
  { path: '/property/property-list', name: 'Property List', element: PropertyList },

  {
    path: '/gates',
    name: <Translation>{(t) => t('Gates')}</Translation>,
    exact: true,
  },
  { path: '/gates/add-gate', name: 'Add Gate', element: AddGate},
  { path: '/gates/gates-list', name: 'Gates', element: GateList },
  { path: '/gates/update-gate/:id', name: 'Update Gate', element: UpdateGate },

  {
    path: '/property-assets',
    name: <Translation>{(t) => t('Property Assets')}</Translation>,
    exact: true,
  },
  { path: '/property-assets/add-assets', name: 'Add Assets', element: AddAssets },
  { path: '/property-assets/assets-list', name: 'Assets List', element: AssetsList },
  { path: '/property-assets/update-assets/:id', name: 'Update Assets', element: UpdateAssets},

  {
    path: '/sectors',
    name: <Translation>{(t) => t('Sectors')}</Translation>,
    exact: true,
  },
  { path: '/sectors/add-sector', name: 'Add Sector', element: AddSector },
  { path: '/sectors/sectors-list', name: 'Sectors', element: SectorsList },
  { path: '/sectors/update-sectors/:id', name: 'Update Sectors', element: UpdateSector },

  {
    path: '/blocks',
    name: <Translation>{(t) => t('Blocks')}</Translation>,
    exact: true,
  },
  { path: '/blocks/add-block', name: 'Add Block', element: AddBlock },
  { path: '/blocks/blocks-list', name: 'Blocks', element: BlocksList },
  { path: '/blocks/update-block/:id', name: 'Update Block', element: UpdateBlock},

  {
    path: '/units',
    name: <Translation>{(t) => t('Units')}</Translation>,
    exact: true,
  },
  { path: '/units/add-unit', name: 'Add Unit', element: AddUnit },
  { path: '/units/units-list', name: 'Units', element: UnitsList },
  { path: '/units/update-unit/:id', name: 'Update Unit', element: UpdateUnit},
  
  {
    path: '/amenity-master',
    name: <Translation>{(t) => t('Amenity Master')}</Translation>,
    exact: true,
  },
  { path: '/amenity-masters/add-amenity-master', name: 'Add Amenity Master', element: AddMaster },
  { path: '/amenity-masters/amenity-masters-list', name: 'Amenity Masters', element: MastersList },
  { path: '/amenity-masters/update-master/:id', name: 'Update Masters', element:  UpdateMaster },

  {
    path: '/amenities',
    name: <Translation>{(t) => t('Amenities')}</Translation>,
    exact: true,
  },
  { path: '/amenity/add-amenity', name: 'Add Amenity', element: AddAmenity },
  { path: '/amenity/amenity-list', name: 'Property Amenities', element: AmenityList },
  { path: '/amenities/update-amenity/:id', name: 'Update Amenity', element: UpdateAmenity },


  {
    path: '/application-module',
    name: <Translation>{(t) => t('Application Module')}</Translation>,
    exact: true,
  },
  { path: '/application-module/add-module', name: 'Add Application Module', element: AddModule},
  { path: '/application-module/module-list', name: 'Application Module', element: ModuleList},
  { path: '/application-module/update-module/:id', name: 'Application Module', element: UpdateModule},
  
  
  {
    path: '/bank-details',
    name: <Translation>{(t) => t('Bank Details')}</Translation>,
    exact: true,
  },
  { path: '/bank-details/add-bank', name: 'Add Bank Details', element: AddBank},
  { path: '/bank-details/bank-list', name: 'Bank Details', element: BankList},
  { path: '/bank-details/update-bank/:id', name: 'Update Bank Details', element: UpdateBank},

  {
    path: '/office-details',
    name: <Translation>{(t) => t('Office Details')}</Translation>,
    exact: true,
  },
  { path: '/office-details/add-office', name: 'Add Office Details', element: AddOffice},
  { path: '/office-details/office-list', name: 'Office Details', element: OfficeList},
  { path: '/office-details/update-office/:id', name: 'Update Office Details', element: UpdateOffice},
  
  {
    path: '/plugins',
    name: <Translation>{(t) => t('plugins')}</Translation>,
    element: Calendar,
    exact: true,
  },
  {
    path: '/plugins/calendar',
    name: <Translation>{(t) => t('calendar')}</Translation>,
    element: Calendar,
  },
  {
    path: '/plugins/charts',
    name: <Translation>{(t) => t('charts')}</Translation>,
    element: Charts,
  },
  
  { path: '/widgets', name: <Translation>{(t) => t('widgets')}</Translation>, element: Widgets },
  {
    path: '/apps',
    name: <Translation>{(t) => t('apps')}</Translation>,
    element: Invoice,
    exact: true,
  },
  { path: '/apps/invoicing', name: 'Invoice', element: Invoice, exact: true },
  { path: '/apps/invoicing/invoice', name: 'Invoice', element: Invoice },
  { path: '/apps/email', name: 'Email', exact: true },
  { path: '/apps/email/inbox', name: 'Inbox', exact: true },
  { path: '/apps/email/compose', name: 'Compose', exact: true },
  { path: '/apps/email/message', name: 'Message', exact: true },
]

export default routes
