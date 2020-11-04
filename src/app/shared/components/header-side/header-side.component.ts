import { Component, OnInit, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { LayoutService } from '../../services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'app/shared/services/auth/authentication.service';
import { Member } from 'app/shared/models/member.model';
import { MembersService } from 'app/shared/services/members/members.service';
import { AmplifyService } from 'aws-amplify-angular';
import Auth, { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { Hub, ICredentials } from '@aws-amplify/core';


@Component({
  selector: 'app-header-side',
  styleUrls: ['./header-side.template.scss'],
  templateUrl: './header-side.template.html'
})
export class HeaderSideComponent implements OnInit {
  @Input() notificPanel;

  public member: Member;
  public sidebarOpen = true;

  public egretThemes;
  public layoutConf:any;
  constructor(
    private themeService: ThemeService,
    private layout: LayoutService,
    private renderer: Renderer2,
    private auth: AuthenticationService,
    private memberService: MembersService,
    private amplifyService: AmplifyService
  ) {}
  ngOnInit() {
    // this.member = this.memberService.getMember();
    this.egretThemes = this.themeService.egretThemes;
    this.layoutConf = this.layout.layoutConf;
  }

  changeTheme(theme) {
    // this.themeService.changeTheme(theme);
  }
  toggleNotific() {
    this.notificPanel.toggle();
  }
  toggleSidenav() {
    if(this.layoutConf.sidebarStyle === 'closed') {
      this.sidebarOpen = true;
      return this.layout.publishLayoutChange({
        sidebarStyle: 'full'
      })
    }
    this.sidebarOpen = false;
    this.layout.publishLayoutChange({
      sidebarStyle: 'closed'
    })
  }

  toggleCollapse() {
    // compact --> full
    if(this.layoutConf.sidebarStyle === 'compact') {
      return this.layout.publishLayoutChange({
        sidebarStyle: 'full',
        sidebarCompactToggle: false
      }, {transitionClass: true})
    }

    // * --> compact
    this.layout.publishLayoutChange({
      sidebarStyle: 'compact',
      sidebarCompactToggle: true
    }, {transitionClass: true})

  }

  onSearch(e) {
    //   console.log(e)
  }

  logout() {
    // this.auth.logout();
    this.auth.signOut();
  }
}