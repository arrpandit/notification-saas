/* eslint-disable @typescript-eslint/unbound-method */
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-notification',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './create-notification.html',
  styleUrl: './create-notification.scss',
})
export class CreateNotification {
  notificationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.notificationForm = this.fb.group({
      title: ['', Validators.required],
      channel: ['', Validators.required],
      recipient: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  sendNotification(): void {
    if (this.notificationForm.invalid) {
      this.notificationForm.markAllAsTouched();
      return;
    }

    console.log(this.notificationForm.value);
  }
}
