import { PrivacyComponent } from './components/privacy/privacy.component';
import { ComplaintsComponent } from './components/complaints/complaints.component';
import { ErrorComponent } from './components/error/error.component';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Aqui es donde se colocan las rutas por defecto esta la del mapa y la de errores para que no muestre mucha informacion
const routes: Routes = [
  { path: '', component: ComplaintsComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

