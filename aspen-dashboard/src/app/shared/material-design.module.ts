import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MatButtonModule, MatMenuModule, MatIconModule,
  MatCardModule, MatSidenavModule, MatFormFieldModule,
  MatInputModule, MatToolbarModule, MatSelectModule, MatDividerModule,
  MatGridListModule, MatRadioModule, MatDialogModule,
  MatTableModule, MatPaginatorModule, MatSortModule,
  MatDatepickerModule, MatListModule, MatCheckboxModule, MatProgressSpinnerModule, MatButtonToggleModule, MAT_DATE_LOCALE
} from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatToolbarModule,
    MatSelectModule,
    MatDividerModule,
    MatGridListModule,
    MatRadioModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRippleModule,
    MatListModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule
  ],
  exports: [
    FormsModule, ReactiveFormsModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatToolbarModule,
    MatRippleModule,

    MatSelectModule,
    MatDividerModule,
    MatGridListModule,
    MatRadioModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatAutocompleteModule
  ],
  providers: [
    // {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
  ]
})
export class MaterialDesignModule { }
