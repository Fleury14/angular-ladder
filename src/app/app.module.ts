import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';

import { ContactComponent } from './sub-pages/contact/contact.component';

const routes: Routes = [{
  path: '',
  component: HomeComponent
},
{
  path: 'contact',
  component: ContactComponent
}];

@NgModule({
  declarations: [
    AppComponent, NavComponent, FooterComponent, HomeComponent, ContactComponent
  ],
  imports: [
    BrowserModule, RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
