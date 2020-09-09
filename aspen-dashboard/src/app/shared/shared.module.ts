import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'
import { NavbarComponent } from './components/navbar/navbar.component';
import { MaterialDesignModule } from './material-design.module';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [NavbarComponent, LoaderComponent],
  imports: [
    CommonModule, RouterModule,
    FormsModule, ReactiveFormsModule,
    MaterialDesignModule
  ],
  exports: [
    NavbarComponent, FormsModule,
    ReactiveFormsModule, MaterialDesignModule, LoaderComponent
  ]
})
export class SharedModule { }
