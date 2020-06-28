import {NbMenuItem} from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Patients',
    icon: {
      icon: 'user-md',
      pack: 'fa',
    },
    link: '/pages/patients/list',
  },
  {
    title: 'Cabinets',
    icon: {
      icon: 'building',
      pack: 'fa',
    },
    link: '/pages/offices/list',
  },
];
