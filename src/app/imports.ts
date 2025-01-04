// Import PrimeNG modules

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { NgModule } from '@angular/core';
import { DocumentosService } from './services/documentos.service';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SidebarModule } from 'primeng/sidebar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        IconFieldModule,
        InputIconModule,
        DialogModule,
        InputTextModule,
        FormsModule,
        DropdownModule,
        FileUploadModule,
        ConfirmDialogModule,
        ToastModule,
        ProgressSpinnerModule,
        SidebarModule,
        InputSwitchModule,
        FloatLabelModule,
        PasswordModule,
        CardModule,
        RouterModule,
        ReactiveFormsModule
    ],
    exports: [
        CommonModule,
        TableModule,
        ButtonModule,
        IconFieldModule,
        InputIconModule,
        DialogModule,
        InputTextModule,
        FormsModule,
        DropdownModule,
        FileUploadModule,
        ConfirmDialogModule,
        ToastModule,
        ProgressSpinnerModule,
        SidebarModule,
        InputSwitchModule,
        FloatLabelModule,
        PasswordModule,
        CardModule,
        RouterModule,
        ReactiveFormsModule
    ]
})
export class ImportsModule { }