import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AdminDashboardComponent } from './dashboards/admin-dashboard/admin-dashboard.component';
import { AgentDashboardComponent } from './dashboards/agent-dashboard/agent-dashboard.component';
import { UserDashboardComponent } from './dashboards/user-dashboard/user-dashboard.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'admin-dashboard', 
    component: AdminDashboardComponent, 
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },
  { 
    path: 'agent-dashboard', 
    component: AgentDashboardComponent, 
    canActivate: [AuthGuard],
    data: { role: 'AGENT' }
  },
  { 
    path: 'user-dashboard', 
    component: UserDashboardComponent, 
    canActivate: [AuthGuard],
    data: { role: 'USER' }
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
