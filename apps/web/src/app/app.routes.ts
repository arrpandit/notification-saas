import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Notifications } from './notifications/notifications';
import { Templates } from './templates/templates';
import { Logs } from './logs/logs';
import { Settings } from './settings/settings';
import { CreateNotification } from './create-notification/create-notification';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: 'notifications',
    component: Notifications,
  },
  {
    path: 'templates',
    component: Templates,
  },
  {
    path: 'logs',
    component: Logs,
  },
  {
    path: 'settings',
    component: Settings,
  },
  {
    path: 'notifications/create',
    component: CreateNotification,
  },
];
