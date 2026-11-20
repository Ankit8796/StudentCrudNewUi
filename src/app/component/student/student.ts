import { Component, OnInit } from '@angular/core';
import { IreturnMessage, Istudent } from '../../interface/istudent';
import { Studentservice } from '../../service/studentservice';
import { CommonModule } from '@angular/common';
import { Gender } from '../../enums/gender';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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


  constructor(private studentService: Studentservice, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.buildStudentForm();
    this.getAllStudents();
  }

  buildStudentForm() {
    this.studentForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      gender: [Gender.Male, Validators.required],
      dateOfBirth: ['', Validators.required]
    });
  }

  getAllStudents() {
    this.studentService.getAllStudents().subscribe((students: Istudent[]) => {
      this.studentList = students;
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
        }

      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
}



  editStudent(student: Istudent) {
    this.isEdit = true;
    const formattedDate = student.dateOfBirth
      ? student.dateOfBirth.split('T')[0]
      : '';
    this.studentForm.patchValue({
      id: student.studentId,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      gender: student.gender,
      dateOfBirth: formattedDate
    })
    this.openModal();
  }

  updateStudent() {
    this.studentService.updateStudent(this.studentForm.value).subscribe({
      next: (result: IreturnMessage) => {
        // this.toastr.success('Student Updated!', 'Success');
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
        alert('Student deleted successfully.');
        this.getAllStudents();
      },
      error: (err) => {
        console.error(err);
        alert('Unable to delete student.');
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
