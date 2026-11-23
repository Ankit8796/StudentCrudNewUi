import { Component, OnInit } from '@angular/core';
import { IFilterStudent, IreturnMessage, Istudent } from '../../interface/istudent';
import { Studentservice } from '../../service/studentservice';
import { CommonModule } from '@angular/common';
import { Gender } from '../../enums/gender';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any

@Component({
  selector: 'app-student',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student.html',
  styleUrl: './student.css',
})
export class Student implements OnInit {
  studentForm!: FormGroup
  studentList: Istudent[] = [];
  isEdit: boolean = false;
  genders = [
    { id: Gender.Male, name: 'Male' },
    { id: Gender.Female, name: 'Female' },
    { id: Gender.Other, name: 'Other' }
  ];


  constructor(private studentService: Studentservice, private formBuilder: FormBuilder,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.buildStudentForm();
    this.getAllStudents();
  }

  buildStudentForm() {
    this.studentForm = this.formBuilder.group({
      studentId: [0],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      gender: [Gender.Male, Validators.required],
      dateOfBirth: ['', Validators.required]
    });
  }

  getAllStudents() {debugger
     const studentFilter: IFilterStudent = {
       pageNumber: 1
     };

    this.studentService.getAllStudents(studentFilter).subscribe((students: any) => {
      this.studentList = students.data;
    });
  }

  openAddModal(): void {
    this.isEdit = false;
    this.studentForm.reset();
    this.openModal();
  }


 OnSubmit() {

  if (this.studentForm.invalid) {
    this.studentForm.markAllAsTouched();
    return;
  }

  if (this.isEdit) {
    this.updateStudent();
  }
  else {
    this.studentService.createStudent(this.studentForm.value).subscribe({
      next: (result: IreturnMessage) => {

        if (result.success) {
          this.closeModel();
          this.studentForm.reset();
          this.getAllStudents();
          this.toastr.success('Student added successfully!', 'Success');
        }

      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
}



  editStudent(student: Istudent) {debugger
    this.isEdit = true;
    const formattedDate = student.dateOfBirth
      ? student.dateOfBirth.split('T')[0]
      : '';
    this.studentForm.patchValue({
      studentId: student.studentId,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      gender: student.gender,
      dateOfBirth: formattedDate
    })
    this.openModal();
  }

  updateStudent() {debugger
    this.studentService.updateStudent(this.studentForm.value).subscribe({
      next: (result: IreturnMessage) => {
        this.toastr.success('Student Updated!', 'Success');
        this.studentForm.reset();
        this.closeModel();
        this.isEdit = false;
        this.getAllStudents();
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  deleteStudent(studentId: number): void {

    if (!confirm('Are you sure you want to delete this student?')) {
      return;
    }

    this.studentService.deleteStudent(studentId).subscribe({
      next: () => {
        // alert('Student deleted successfully.');
        this.toastr.success('Student deleted successfully!', 'Success');
        this.getAllStudents();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Unable to delete student.', 'Error');
      }
    });
  }



  openModal() {
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }

  }
  closeModel() {
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }



}
