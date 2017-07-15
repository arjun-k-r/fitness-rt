// App
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

const EMAIL_REGEX: RegExp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

interface ValidationResult {
    [key: string]: boolean;
}

@Injectable()
export class AuthValidationService {
    static emailValidation(control: AbstractControl): ValidationResult {
        return EMAIL_REGEX.test(control.value) ? null : { 'invalidEmailAddress': true };
    }

    static getErrorMessage(errorName: string, error?): string {
        let validationMessages = {
            'invalidEmailAddress': 'Your email is not valid. It must be something like user@domain.com',
            'invalidPassword': 'Spaces are not allowed',
            'invalidUsername': 'Spaces, numbers, or special characters are not allowed',
            'maxlength': `Maximum length ${error.requiredLength}`,
            'minlength': `Minimum length ${error.requiredLength}`,
            'mismatchedPasswords': 'Passwords do not match.',
            'noWhiteSpace': 'Contains white spaces',
            'required': 'This field is required',
            'required_email': 'You need an email for registration',
            'required_password': 'You need a password for registration'
        };

        return (errorName in validationMessages) ? validationMessages[errorName] : 'Unknown Error';
    }

    static noWhiteSpaceValidation(control: AbstractControl): ValidationResult {
        return (!!control.value && control.value.trim() !== '') ? null : { 'noWhiteSpace': true }
    }

    static passwordValidation(control: AbstractControl): ValidationResult {
        return control.value.match(/^[^ ]*$/) ? null : { 'invalidPassword': true };
    }

    static passwordMatchValidation(control: AbstractControl): ValidationResult {
        let password: AbstractControl = control.get('password'),
            confirm: AbstractControl = control.get('passwordConfirm');
        
        return (password && confirm && password.value != confirm.value) ? { 'mismatchedPasswords': true } : null;
    }

    static usernameValidation(control: AbstractControl): ValidationResult {
        return (control.value.trim() === '' || control.value.match(/^[a-zA-Z]+$/)) ? null : { 'invalidUsername': true };
    }
}
