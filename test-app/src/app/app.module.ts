import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { TestLibModule } from 'test-lib'

import { AppComponent } from './app.component';
import { Test1Component } from './test1/test1.component';

@NgModule({
  declarations: [
    AppComponent,
    Test1Component
  ],
  imports: [
    BrowserModule,
    TestLibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
