import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface IMenuItem {
  type: string; // Possible values: link/dropDown/icon/separator/extLink
  name?: string; // Used as display text for item and title for separator type
  state?: string; // Router state
  icon?: string; // Material icon name
  tooltip?: string; // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]; // Dropdown items
  badges?: IBadge[];
}
interface IChildItem {
  type?: string;
  name: string; // Display text
  state?: string; // Router state
  icon?: string;
  sub?: IChildItem[];
}

interface IBadge {
  color: string; // primary/accent/warn/hex color codes(#fff000)
  value: string; // Display text
}

@Injectable()
export class NavigationService {

  plainMenu: IMenuItem[] = [
    {
      name: 'Dashboard',
      type: 'link',
      tooltip: 'Dashboard',
      icon: 'dashboard',
      state: 'dashboard',
    },
    {
      name: 'League',
      type: 'link',
      tooltip: 'League',
      icon: 'stars',
      state: 'league',
    },
    {
      name: 'Meets',
      type: 'dropDown',
      tooltip: 'Meets',
      icon: 'fitness_center',
      state: 'meets',
      sub: [
        { name: 'Overview', state: '' },
        // { name: 'List', state: 'list' },
        // { name: 'Requests', state: 'requests'}
      ]
    },
    {
      name: 'Members',
      type: 'dropDown',
      tooltip: 'Members',
      icon: 'people',
      state: 'members',
      sub: [
        { name: 'Overview', state: '' },
        // { name: 'List', state: 'list' },
      ]
    },
    {
      name: 'Memberships',
      type: 'dropDown',
      tooltip: 'Memberships',
      icon: 'card_membership',
      state: 'memberships',
      sub: [
        { name: 'Overview', state: '' },
        // { name: 'List', state: 'list' },
      ]
    },
    {
      name: 'Coordinators',
      type: 'dropDown',
      tooltip: 'Coordinators',
      icon: 'supervised_user_circle',
      state: 'coordinators',
      sub: [
        { name: 'Overview', state: '' },
        // { name: 'List', state: 'list' },
        // { name: 'Applications', state: 'applications'}
      ]
    },
    {
      name: 'Records',
      type: 'dropDown',
      tooltip: 'Records',
      icon: 'assessment',
      state: 'records',
      sub: [
        // { name: 'Overview', state: '' },
        { name: 'Records', state: '' },
        // { name: 'Record Groups', state: 'record-groups' },
      ]
    },
    {
      name: 'News',
      type: 'dropDown',
      tooltip: 'News',
      icon: 'chat',
      state: 'news',
      sub: [
        { name: 'Overview', state: '' },
        // { name: 'Articles', state: 'list' },
      ]
    },
    // {
    //   name: 'Gallery',
    //   type: 'link',
    //   tooltip: 'Gallery',
    //   icon: 'photo',
    //   state: 'gallery',
    // },
    {
      name: 'Account',
      type: 'link',
      tooltip: 'Settings',
      icon: 'settings',
      state: 'settings',
    },
  ];

  // Icon menu TITLE at the very top of navigation.
  // This title will appear if any icon type item is present in menu.
  iconTypeMenuTitle: string = 'Frequently Accessed';
  // sets iconMenu as default;
  menuItems = new BehaviorSubject<IMenuItem[]>(this.plainMenu);
  // navigation component has subscribed to this Observable
  menuItems$ = this.menuItems.asObservable();

  constructor() {}

  // Customizer component uses this method to change menu.
  // You can remove this method and customizer component.
  // Or you can customize this method to supply different menu for
  // different user type.

  publishNavigationChange(menuType: string) {
    // switch (menuType) {
    //   case 'separator-menu':
    //     this.menuItems.next(this.separatorMenu);
    //     break;
    //   case 'icon-menu':
    //     this.menuItems.next(this.iconMenu);
    //     break;
    //   default:
    //     this.menuItems.next(this.plainMenu);
    // }
  }
}
