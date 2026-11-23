import { Routes } from '@angular/router';
import { Student } from './component/student/student';

export const routes: Routes = [
    {path: '', pathMatch: 'full',loadComponent: () => import('./component/student/student').then(m => m.Student)}
];
