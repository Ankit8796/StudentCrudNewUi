import { Gender } from "../enums/gender";

export interface Istudent {
    studentId: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    gender: Gender;
    dateOfBirth: string;
}
export interface IreturnMessage
{
    message?:string,
    success:string
}