import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import IUser from 'src/app/models/user.model';

import { AuthService } from 'src/app/services/auth.service';

import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private auth: AuthService, private EmailTaken: EmailTaken) {}

  inSubmission = false;

  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email = new FormControl(
    '',
    [Validators.required, Validators.email],
    [this.EmailTaken.validate]
  );
  age = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(18),
    Validators.max(120),
  ]);
  // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/gm
    ),
  ]); // Ex Test1@test
  confirm_password = new FormControl('', [Validators.required]);
  phone_number = new FormControl('', [
    Validators.required,
    Validators.min(10),
    Validators.max(10),
  ]);

  showAlert = false;
  alertMsg = 'Please wait! Your account is being created';
  alertColor = 'blue';

  registerForm = new FormGroup(
    {
      name: this.name,
      email: this.email,
      age: this.age,
      password: this.password,
      confirm_password: this.confirm_password,
      phoneNumber: this.phone_number,
    },
    [RegisterValidators.match('password', 'confirm_password')]
  );

  async register() {
    this.inSubmission = true;
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account is being created';
    this.alertColor = 'blue';

    try {
      await this.auth.createUser(this.registerForm.value as IUser);
    } catch (err) {
      console.error(err);
      this.alertMsg = 'Error, pls retry';
      this.alertColor = 'red';
      return;
    }
    this.alertMsg = 'Success! Your account has been successfully created.';
    this.alertColor = 'green';
    this.inSubmission = false;
  }
}
