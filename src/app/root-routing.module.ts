import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'app',
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./pages/app/app.routes').then((mod) => mod.APP_ROUTES),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      paramsInheritanceStrategy: 'always',
      useHash: true,
      anchorScrolling: 'enabled',
      enableTracing: false,
    }),
  ],
  exports: [RouterModule],
})
export class RootRoutingModule {}
