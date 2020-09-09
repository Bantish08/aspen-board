import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import * as  SecureLS from 'secure-ls';
import { Subscription } from 'rxjs';
import { DashboardService } from 'src/app/dashboard/services/dashboard.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  releaseLogout: Subscription;
  releaseDashboardData: Subscription;
  processListArr = [];
  taskListArr = [];
  reportListArr = [];
  isAdmin: any;
  userName: any;
  constructor(private authservice: AuthService, private dashboardservice: DashboardService,
    private jwtHelper: JwtHelperService, private toastr: ToastrService, private router: Router) {
    this.getUserAccessRoles();
  }

  ngOnDestroy() {
    if (this.releaseLogout) {
      this.releaseLogout.unsubscribe();
    }
  }

  ngOnInit() {
  }

  getUserAccessRoles() {

    this.dashboardservice.add()

    var ls = new SecureLS();
    let token = ls.get('token').data;
    let decodedTokenFromServer = this.jwtHelper.decodeToken(token); // decoding the token here
    let userId = decodedTokenFromServer.sub; // taking the userId value from token
    this.userName = decodedTokenFromServer.sub
    let objParams = {
      userId: userId,

    }
    this.releaseDashboardData = this.dashboardservice.getUserRolesAndPermissions(objParams).subscribe(data => {
      if (data && data['statusCode'] === '200' && data['result'] && data['result'][0]) {
        let processData = data['result'][0].processMasterEntityList;
        let taskData = data['result'][0].taskList;
        let reportData = data['result'][0].reports;
        this.isAdmin = data['result'][0].admin;

        for (let i = 0; i < processData.length; i++) {
          this.processListArr.push(processData[i])
        }
        for (let j = 0; j < taskData.length; j++) {
          this.taskListArr.push(taskData[j]);
        }

        for (let k = 0; k < reportData.length; k++) {
          this.reportListArr.push(reportData[k])
        }
      }
    }, error => {
      this.toastr.error(error ? error : 'Http Failure Error')
    }, () => {
      //cycle completed
    });

  }

  navigate(data, label) {

    var ls = new SecureLS();

    let processName = data.processShortName;
    
    switch (processName) {
      case 'UCPR':
        switch (label) {
          case 'process': this.router.navigate(['bpm/ucpr-process'])
            break;
          case 'tasks': ls.set('accessGroups', { data: data.teamTaskEnabled });
            this.router.navigate(['bpm/ucpr-tasks']);
            break;
          case 'reports': this.router.navigate(['bpm/ucpr-reports'])
            break;
          default:
            break;
        }
        break;
      case 'administrator':
        switch (label) {
          case 'admin': this.router.navigate(['bpm/administrator'])
            break;
          default:
            break;
        }
        break;
      case 'OBI':
        switch (label) {
          case 'process': this.router.navigate(['bpm/cob-process'])
            break;
          case 'tasks': ls.set('accessGroups', { data: data.teamTaskEnabled });
            this.router.navigate(['bpm/cob-tasks']);
            break;
          case 'reports': this.router.navigate(['bpm/cob-reports'])
            break;
          default:
            break;
        }
        break;
      case 'MOF':

        break;
      case 'ENC':

        break;
      case 'IK':
        switch (label) {
          case 'process': this.router.navigate(['bpm/instakit-process'])
            break;
          case 'tasks': ls.set('accessGroups', { data: data.teamTaskEnabled });
            this.router.navigate(['bpm/instakit-tasks']);
            break;
          case 'reports': this.router.navigate(['bpm/instakit-reports'])
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  }

  // navigate() {
  //   this.router.navigate(['bpm/'])
  // }

  /*
  Name of Author : Ketan Pande
  Function Name : logout()
  Description : This function is used to logout user from the application. When user clicks on logout button on navbar, it will redirect him to the
                 login page by clearing the token stored in local storage.
   */
  logout() {
    var ls = new SecureLS();
    let token = ls.get('token').data;
    let decodedTokenFromServer = this.jwtHelper.decodeToken(token); // decoding the token here
    let userId = decodedTokenFromServer.sub; // taking the userId value from token

    let objParams = {
      userId: userId
    }

    this.releaseLogout = this.authservice.logout(objParams).subscribe(data => {
      if (data.statusCode === "200") {
        this.toastr.success("Logout Successfully!");
        ls.clear();
        this.router.navigate(['/'])
      }
      else {
        this.toastr.error("Something Went Wrong")
      }
    }, error => {
      // this.toastr.error( ('message' in error && error.message != '' ? error.message : 'Http Failure Error') );
      // error cycle of subscribe

    }, () => {
      // complete cycle of subscribe
    });
  }

}
