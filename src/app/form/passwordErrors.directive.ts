import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[passwordErrors]',
})
export class passwordErrorsDirective implements OnInit {
  @Input() errorObj: {} = {};
  @Input() customErrors: {} = {};

  passwordPowerDiv;

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    let div = `
  <div
    class="shadow-lg p-3 mb-5 bg-body rounded validationBox"
    style="
    width: 275px;
    height: 214px;
    position: absolute;
    top: -66px;
    left: -290px;
    display: flex;
    flex-direction: column;
    ">
    <span>
      
    </span>
  </div>`;

    this.element.nativeElement.parentElement.insertAdjacentHTML(
      'beforeend',
      div
    );

    // <div style="display: flex; flex-direction: column">
    //     <label for=""> Strength of password </label>
    //     <div class="power-container" style="margin-bottom: 20px">
    //       <div class="power-point" #passwordStrength></div>
    //     </div>
    //   </div>

    // console.log(this.element.nativeElement.parentElement.lastChild);

    let strengthDiv = this.renderer.createElement('div');
    this.renderer.setStyle(strengthDiv, 'display', 'flex');
    this.renderer.setStyle(strengthDiv, 'flexDirection', 'column');

    this.renderer.appendChild(
      strengthDiv,
      this.renderer.createText('Strength of password')
    );

    this.renderer.appendChild(
      this.element.nativeElement.parentElement.lastChild,
      strengthDiv
    );

    // console.log(this.element.nativeElement.parentElement.lastChild.childNodes);

    let containerDiv = this.renderer.createElement('div');
    this.renderer.addClass(containerDiv, 'power-container');
    this.renderer.setStyle(containerDiv, 'marginBottom', '20px');

    let powerDiv = this.renderer.createElement('div');
    this.renderer.addClass(powerDiv, 'power-point');

    this.renderer.appendChild(containerDiv, powerDiv);
    this.renderer.appendChild(strengthDiv, containerDiv);

    this.passwordPowerDiv = powerDiv;

    Object.keys(this.customErrors).forEach((error) => {
      let errorSpan = this.renderer.createElement('span');
      let errorMsg = this.renderer.createText(this.customErrors[error]);

      this.renderer.appendChild(errorSpan, errorMsg);
      this.renderer.addClass(errorSpan, this.getErrorClass(error));
      this.renderer.appendChild(
        this.element.nativeElement.parentElement.lastChild,
        errorSpan
      );
    });
  }

  @HostListener('keyup') input() {
    // console.log(
    //   [...this.element.nativeElement.parentElement.lastChild.childNodes].find(
    //     (child) => {
    //       return child.innerHTML === 'Must contain at least 8 characters';
    //     }
    //   )
    // );
    // console.log(this.passwordPowerDiv);
    if (this.element.nativeElement.value.length === 0) {
      this.element.nativeElement.parentElement.lastChild.style.display = 'none';
    } else {
      this.element.nativeElement.parentElement.lastChild.style.display = 'flex';
      this.strengthCheck(this.element.nativeElement.value);

      Object.keys(this.customErrors).forEach((error) => {
        // console.log(this.errorObj);

        let e = [
          ...this.element.nativeElement.parentElement.lastChild.childNodes,
        ].find((child) => {
          return child.innerHTML === this.customErrors[error];
        });
        if (this.errorObj) {
          if (
            !Object.keys(this.errorObj).some(
              (currentError) => currentError === error
            )
          ) {
            e.classList.add('valid');
            e.classList.remove('invalid');
          } else {
            e.classList.remove('valid');
            e.classList.add('invalid');
          }
        } else {
          e.classList.add('valid');
          e.classList.remove('invalid');
        }
      });
    }
  }

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

    if (this.passwordPowerDiv)
      this.passwordPowerDiv.style.width = widthStrength[strength];

    this.passwordPowerDiv.style.backgroundColor = widthColor[strength];
  }

  getErrorClass(customError) {
    if (
      Object.keys(this.errorObj).some(
        (currentError) => currentError === customError
      )
    ) {
      return 'invalid';
    } else {
      return 'valid';
    }
  }
}
