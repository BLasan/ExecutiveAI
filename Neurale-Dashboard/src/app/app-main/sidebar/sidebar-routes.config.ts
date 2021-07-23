import { RouteInfo } from 'src/app/models/route-info.model';

export const ROUTES: RouteInfo[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: 'flaticon-381-networking',
    submenu: [],
  },
  {
    path: '/data-management',
    title: 'Data Management',
    icon: 'flaticon-381-networking',
    submenu: [],
  },
  {
    path: '/prediction',
    title: 'Prediction',
    icon: 'flaticon-381-television',
    submenu: [
      {
        path: '/train',
        title: 'Train',
        submenu: [],
      },
      {
        path: '/predict',
        title: 'Predict',
        submenu: [],
      },
      {
        path: '/status',
        title: 'Status',
        submenu: [],
      },
    ],
  },
  {
    path: '/cluster',
    title: 'Cluster',
    icon: 'flaticon-381-controls-3',
    class: '',
    submenu: [
      {
        path: '/train',
        title: 'Train',
        submenu: [],
      },
      {
        path: '/predict',
        title: 'Predict',
        submenu: [],
      },
      {
        path: '/status',
        title: 'Status',
        submenu: [],
      },
    ],
  },
  {
    path: '/trend',
    title: 'Trend',
    icon: 'flaticon-381-notepad',
    class: '',
    submenu: [
      {
        path: '/train',
        title: 'Train',
        submenu: [],
      },
    ],
  },
  {
    path: '/team',
    title: 'Team',
    icon: 'flaticon-381-layer-1',
    class: '',
    submenu: [],
  },
];
