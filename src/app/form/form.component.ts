import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent implements OnInit {
  signUpForm: FormGroup;
  @ViewChild('passwordStrength') passwordStrength: ElementRef;
  // errorObj: { [a: string]: boolean } = null;

  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  constructor(private formBuilder: FormBuilder) {}

  onSubmit() {
    console.log(this.signUpForm);
  }

  ngOnInit(): void {
    this.signUpForm = new FormGroup(
      {
        name: new FormControl(null, Validators.required),
        email: new FormControl(null, Validators.required),
        password: new FormControl('', [
          Validators.required,
          this.customValidation,
        ]),
        confirmPassword: new FormControl('', [Validators.required]),

        // validators: this.password.bind(this),
      },
      {
        validators: this.matchPasswordValidator,
      }
    );
  }

  customValidation(control: FormControl): { [a: string]: boolean } {
    let MIN_LENGTH_REGEX = /^[\s\S]{8,1000}$/;
    let NUMERIC_REGEX = /(?=\D*\d)/;
    let SPECIAL_CHAR_REGEX = /(?=[^-!@._*#%]*[-!@._*#%])/;
    let LOWER_CASE_REGEX = /(?=[^a-z]*[a-z])/;
    let UPPER_CASE_REGEX = /(?=[^A-Z]*[A-Z])/;
    let errorObject = {};

    if (!MIN_LENGTH_REGEX.test(control.value)) errorObject['minLength'] = true;
    if (!NUMERIC_REGEX.test(control.value)) errorObject['oneDigit'] = true;
    if (!SPECIAL_CHAR_REGEX.test(control.value))
      errorObject['noSpecialChar'] = true;
    if (!LOWER_CASE_REGEX.test(control.value))
      errorObject['noLowerCase'] = true;
    if (!UPPER_CASE_REGEX.test(control.value))
      errorObject['noUpperCase'] = true;

    return errorObject;
  }

  // minLengthValidator(control: FormControl): { [a: string]: boolean } {
  //   if (!/^[\s\S]{8,1000}$/.test(control.value)) return { minLength: true };
  //   return null;
  // }

  // numericValidator(control: FormControl): { [a: string]: boolean } {
  //   if (!/(?=\D*\d)/.test(control.value)) return { oneDigit: true };
  //   return null;
  // }

  // specialCharValidator(control: FormControl): { [a: string]: boolean } {
  //   if (!/(?=[^-!@._*#%]*[-!@._*#%])/.test(control.value))
  //     return { noSpecialChar: true };
  //   return null;
  // }

  // lowerCaseValidator(control: FormControl): { [a: string]: boolean } {
  //   if (!/(?=[^a-z]*[a-z])/.test(control.value) || !control.value)
  //     return { noLowerCase: true };
  //   return null;
  // }

  // upperCaseValidator(control: FormControl): { [a: string]: boolean } {
  //   if (!/(?=[^A-Z]*[A-Z])/.test(control.value) || !control.value)
  //     return { noUpperCase: true };
  //   return null;
  // }

  matchPasswordValidator: ValidatorFn = (
    group: FormGroup
  ): ValidationErrors | null => {
    let password = group.get('password').value;
    let confirmPassword = group.get('confirmPassword').value;
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    } else return null;
  };

  strengthCheck(password: string) {
    let widthStrength = ['1%', '20%', '40%', '60%', '80%', '100%'];
    let widthColor = [
      '#D73F40',
      '#D73F40',
      '#DC6551',
      '#F2B84F',
      '#BDE952',
      '#3ba62f',
    ];
    let strength = 0;
    let passwordConditions = [
      /^[\s\S]{8,1000}$/,
      /(?=\D*\d)/,
      /(?=[^-!@._*#%]*[-!@._*#%])/,
      /(?=[^a-z]*[a-z])/,
      /(?=[^A-Z]*[A-Z])/,
    ];

    passwordConditions.forEach((condition: RegExp) => {
      if (password.match(condition)) {
        strength += 1;
      }
    });

    if (this.passwordStrength?.nativeElement)
      this.passwordStrength.nativeElement.style.width = widthStrength[strength];
    if (this.passwordStrength?.nativeElement)
      this.passwordStrength.nativeElement.style.backgroundColor =
        widthColor[strength];
  }
}
