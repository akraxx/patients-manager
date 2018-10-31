import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Patients',
    icon: 'fa fa-user-md',
    expanded: true,
    children: [
      {
        title: 'Liste',
        link: '/pages/patients/list',
        pathMatch: '/pages/patients',
      },
      {
        title: 'Nouveau',
        link: '/pages/patients/new',
      },
    ],
  },
];
