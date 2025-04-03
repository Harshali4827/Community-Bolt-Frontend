
import React from 'react'
import { Translation } from 'react-i18next'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const UsersList = React.lazy(() => import('./views/users/users-list/UsersList')) 

const AddUser = React.lazy(() => import('./views/users/add-users/AddUser'))
const UserPropertyList = React.lazy(() => import('./views/user-property-unit/user-property-list/UserPropertyList'))
const UserAllProperty = React.lazy(() => import('./views/user-property-unit/user-property/UserAllProperty'))
const AddUserPropertyUnit = React.lazy(() => import('./views/user-property-unit/add-property-unit/AddPropertyUnit'))

const UserProperty = React.lazy(() => import('./views/user-property/property-list/PropertyList'))
const FileUpload = React.lazy(() => import('./views/import-excel/FileUpload'))

const AddProperty  = React.lazy(() => import('./views/property/add-property/AddProperty'))
const PropertyList = React.lazy(() => import('./views/property/property-list/PropertyList'))
const UpdateProperty = React.lazy(() => import('./views/property/update-property/UpdateProperty'))

const AddGate = React.lazy(() => import('./views/gates/add-gate/AddGate'))
const GateList = React.lazy(() => import('./views/gates/gate-list/GateList'))
const UpdateGate = React.lazy(() => import('./views/gates/update-gate/UpdateGate'))

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

const AddAll = React.lazy(() => import ('./views/add-all/AddAll'));

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
    path: '/users',
    name: <Translation>{(t) => t('Users')}</Translation>,
    element: UsersList,
  },
  { path: '/users/add-user', name: 'Add user', element: AddUser },

  {
    path: '/user-property-list',
    name: <Translation>{(t) => t('Users property units')}</Translation>,
    element: UserPropertyList,
  },

  { path: '/user-property-unit', name: 'Users property units', element: UserPropertyList },
  { path: '/user-property', name: 'Users property', element: UserProperty },
  { path: '/user-property-unit/user-property/:id',name:'User property', element: UserAllProperty},
  { path:'/user-property-unit/add-user-property-unit', name:'Add user property unit', element:AddUserPropertyUnit},

  {
    path: '/import-excel',
    name: <Translation>{(t) => t('Upload excel file')}</Translation>,
    element: FileUpload,
  },
  { path: '/import-excel', name: 'Upload excel file', element: FileUpload },

  {
    path: '/property',
    name: <Translation>{(t) => t('property')}</Translation>,
    exact: true,
  },
  { path: '/property/add-property', name: 'Add property', element: AddProperty },
  { path: '/property/property-list', name: 'Property list', element: PropertyList },
  { path: '/property/update-property/:id', name: 'Update property', element: UpdateProperty },
  {
    path: '/gates',
    name: <Translation>{(t) => t('Gates')}</Translation>,
    exact: true,
  },
  { path: '/gates/add-gate', name: 'Add gate', element: AddGate},
  { path: '/gates/gates-list', name: 'Gates', element: GateList },
  { path: '/gates/update-gate/:id', name: 'Update gate', element: UpdateGate },

  {
    path: '/property-assets',
    name: <Translation>{(t) => t('Property assets')}</Translation>,
    exact: true,
  },
  { path: '/property-assets/add-assets', name: 'Add assets', element: AddAssets },
  { path: '/property-assets/assets-list', name: 'Assets list', element: AssetsList },
  { path: '/property-assets/update-assets/:id', name: 'Update assets', element: UpdateAssets},

  {
    path: '/sectors',
    name: <Translation>{(t) => t('Sectors')}</Translation>,
    exact: true,
  },
  { path: '/sectors/add-sector', name: 'Add sector', element: AddSector },
  { path: '/sectors/sectors-list', name: 'Sectors', element: SectorsList },
  { path: '/sectors/update-sectors/:id', name: 'Update sectors', element: UpdateSector },

  {
    path: '/blocks',
    name: <Translation>{(t) => t('Blocks')}</Translation>,
    exact: true,
  },
  { path: '/blocks/add-block', name: 'Add block', element: AddBlock },
  { path: '/blocks/blocks-list', name: 'Blocks', element: BlocksList },
  { path: '/blocks/update-block/:id', name: 'Update block', element: UpdateBlock},

  {
    path: '/units',
    name: <Translation>{(t) => t('Units')}</Translation>,
    exact: true,
  },
  { path: '/units/add-unit', name: 'Add unit', element: AddUnit },
  { path: '/units/units-list', name: 'Units', element: UnitsList },
  { path: '/units/update-unit/:id', name: 'Update unit', element: UpdateUnit},
  
  {
    path: '/amenity-master',
    name: <Translation>{(t) => t('Amenity master')}</Translation>,
    exact: true,
  },
  { path: '/amenity-masters/add-amenity-master', name: 'Add amenity master', element: AddMaster },
  { path: '/amenity-masters/amenity-masters-list', name: 'Amenity masters', element: MastersList },
  { path: '/amenity-masters/update-master/:id', name: 'Update masters', element:  UpdateMaster },

  {
    path: '/amenities',
    name: <Translation>{(t) => t('Amenities')}</Translation>,
    exact: true,
  },
  { path: '/amenity/add-amenity', name: 'Add amenity', element: AddAmenity },
  { path: '/amenity/amenity-list', name: 'Property amenities', element: AmenityList },
  { path: '/amenities/update-amenity/:id', name: 'Update amenity', element: UpdateAmenity },


  {
    path: '/application-module',
    name: <Translation>{(t) => t('Application module')}</Translation>,
    exact: true,
  },
  { path: '/application-module/add-module', name: 'Add application module', element: AddModule},
  { path: '/application-module/module-list', name: 'Application module', element: ModuleList},
  { path: '/application-module/update-module/:id', name: 'Application module', element: UpdateModule},
  
  
  {
    path: '/bank-details',
    name: <Translation>{(t) => t('Bank Details')}</Translation>,
    exact: true,
  },
  { path: '/bank-details/add-bank', name: 'Add bank details', element: AddBank},
  { path: '/bank-details/bank-list', name: 'Bank details', element: BankList},
  { path: '/bank-details/update-bank/:id', name: 'Update bank details', element: UpdateBank},

  {
    path: '/office-details',
    name: <Translation>{(t) => t('Office Details')}</Translation>,
    exact: true,
  },
  { path: '/office-details/add-office', name: 'Add office details', element: AddOffice},
  { path: '/office-details/office-list', name: 'Office details', element: OfficeList},
  { path: '/office-details/update-office/:id', name: 'Update office details', element: UpdateOffice},

  { path: '/add-all', name: 'Add all details under property', element: AddAll},
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
