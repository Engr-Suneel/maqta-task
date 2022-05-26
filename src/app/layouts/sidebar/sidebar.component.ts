import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppConst } from 'src/app/helpers/app-constants';
import { IMenuItem } from './menu-item';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  subscription: Subscription = new Subscription();
  @Output() menuToggleState = new EventEmitter<boolean>();
  menuList: Array<IMenuItem> = [];

  isCollapsed: boolean = true;
  isSideBarAbs: boolean = false;

  @ViewChild('AppSideBarContent') appSideBarContent?: ElementRef;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.menuList = [
      {
        id: 1,
        icon: "bi bi-speedometer",
        label: "Dashboard",
        link: "/dashboard",
        isActive: false,
      },
      {
        id: 2,
        icon: "bi bi-people",
        label: "Employees",
        link: "/employees",
        isActive: false,
        queryParams: {
          pageNo: AppConst.PAGE_NO,
          pageSize: AppConst.PAGE_SIZE
        }
      },
    ];
    this.getActivePath();
  }

  getActivePath() {
    this.menuList.forEach((menu, index) => {
      if (menu?.subItems?.length) {

        menu.subItems.forEach((subMenu, subIndex) => {
          let url = this.router.url;
          if (this.router.url.indexOf('?') > -1) {
            url = this.router.url.split('?')[0];
          }

          if (subMenu.link == url) {
            this.menuList[index].isActive = true;
            this.menuList[index].isExpend = true;
            this.menuList[index].subItems![subIndex].isActive = true;
          }
        });
      } else {
        let url = this.router.url;
        if (this.router.url.indexOf('?') > -1) {
          url = this.router.url.split('?')[0];
        }
        if (menu.link == url) {
          this.menuList[index].isActive = true;
        }
      }
    });
  }

  toggleState() {
    this.menuToggleState.emit(true);
    this.isCollapsed = !this.isCollapsed;
  }

  logoClick() {
    this.isSideBarAbs = false;
    this.router.navigate(["/"]);
  }

  hideMenu(event: any) {
    event.preventDefault();
    this.isSideBarAbs = false;
    this.menuList.forEach((menu, index) => {
      this.menuList[index].isExpend = false;
    });
  }

  preventMenu(event: any) {
    event.stopPropagation();
  }

  onMenuItemClick(item: IMenuItem) {
    this.menuList.forEach((menu, index) => {
      this.menuList[index].isActive = false;
      this.menuList[index].isExpend = false;

      if (this.menuList[index]?.subItems?.length) {
        menu?.subItems?.forEach((subMenu, subIndex) => {
          this.menuList[index].subItems![subIndex].isActive = false;
        });
      }
    });

    let index = this.menuList.findIndex(o => o.id == item.id);
    if (index > -1) {
      this.menuList[index].isActive = true;
    }

    this.isSideBarAbs = false;
    if (item.queryParams) {
      this.router.navigate([item.link], { queryParams: item.queryParams });
    } else {
      this.router.navigate([item.link]);
    }
  }

  toggleSubMenu(menu: IMenuItem) {
    let index = this.menuList.findIndex(o => o.id == menu.id);
    if (index > -1) {
      this.menuList[index].isExpend = !this.menuList[index].isExpend;
    }
  }

  onSubMenuItemClick(item: IMenuItem, subItem: IMenuItem) {
    this.menuList.forEach((menu, index) => {
      this.menuList[index].isActive = false;
      this.menuList[index].isExpend = false;

      if (this.menuList[index]?.subItems?.length) {
        menu?.subItems?.forEach((subMenu, subIndex) => {
          this.menuList[index].subItems![subIndex].isActive = false;
        });
      }
    });

    let index = this.menuList.findIndex(o => o.id == item.id);
    if (index > -1) {
      this.menuList[index].isActive = true;
      this.menuList[index].isExpend = true;

      if (this.menuList[index]?.subItems?.length) {
        let subIndex = this.menuList[index]?.subItems?.findIndex(o => o.id == subItem.id) ?? -1;
        if (subIndex > -1) {
          this.menuList[index].subItems![subIndex].isActive = true;
        }
      }
    }

    this.isSideBarAbs = false;

    setTimeout(() => {
      let sideBarWidth = this.appSideBarContent?.nativeElement?.offsetWidth;
      if (sideBarWidth > 0 && sideBarWidth < 65) {
        this.menuList.forEach((menu, index) => {
          this.menuList[index].isExpend = false;
        });
      }
    }, 0);

    if (subItem?.link) {
      this.router.navigate([subItem?.link]);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
