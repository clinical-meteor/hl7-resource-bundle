

import BundlesPage from './client/BundlesPage';
import BundleTable from './client/BundleTable';
import BundleDetail from './client/BundleDetail';

import { Bundle, Bundles, BundleSchema } from './lib/Bundles';

var DynamicRoutes = [{
  'name': 'BundlePage',
  'path': '/bundles',
  'component': BundlesPage,
  'requireAuth': true
}];

var SidebarElements = [{
    'primaryText': 'Bundles',
    'to': '/bundles',
    'href': '/bundles'
  }];
  
var AdminSidebarElements = [{
  'primaryText': 'Bundles',
  'to': '/bundles',
  'href': '/bundles'
}];

export { 
  SidebarElements,
  AdminSidebarElements, 
  DynamicRoutes, 

  BundlesPage,
  BundleTable,
  BundleDetail,

  Bundle,
  Bundles,
  BundleSchema
};


