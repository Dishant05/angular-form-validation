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
          this.minLengthValidator,
          this.numericValidator,
          this.specialCharValidator,
          this.lowerCaseValidator,
          this.upperCaseValidator,
        ]),
        confirmPassword: new FormControl('', [Validators.required]),

        // validators: this.password.bind(this),
      },
      {
        validators: this.matchPasswordValidator,
      }
    );
  }

  minLengthValidator(control: FormControl): { [a: string]: boolean } {
    if (!/^[\s\S]{8,1000}$/.test(control.value)) return { minLength: true };
    return null;
  }

  numericValidator(control: FormControl): { [a: string]: boolean } {
    if (!/(?=\D*\d)/.test(control.value)) return { oneDigit: true };
    return null;
  }

  specialCharValidator(control: FormControl): { [a: string]: boolean } {
    if (!/(?=[^-!@._*#%]*[-!@._*#%])/.test(control.value))
      return { noSpecialChar: true };
    return null;
  }

  lowerCaseValidator(control: FormControl): { [a: string]: boolean } {
    if (!/(?=[^a-z]*[a-z])/.test(control.value) || !control.value)
      return { noLowerCase: true };
    return null;
  }

  upperCaseValidator(control: FormControl): { [a: string]: boolean } {
    if (!/(?=[^A-Z]*[A-Z])/.test(control.value) || !control.value)
      return { noUpperCase: true };
    return null;
  }

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

    passwordConditions.forEach((condition) => {
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

  passwordVisibility(e) {
    if (this.passwordVisible) {
      e.target.closest('div').querySelector('input').type = 'text';
    } else {
      e.target.closest('div').querySelector('input').type = 'password';
    }
    this.passwordVisible = !this.passwordVisible;
  }

  confirmPasswordVisibility(e) {
    if (this.confirmPasswordVisible) {
      e.target.closest('div').querySelector('input').type = 'text';
    } else {
      e.target.closest('div').querySelector('input').type = 'password';
    }
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }
}
