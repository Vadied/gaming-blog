import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';

import { ModalService } from 'src/app/services/modal.service';
import { ClipService } from 'src/app/services/clip.service';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import IClip from 'src/app/models/clip.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null;

  @Output() update = new EventEmitter();

  clipID = new FormControl('', {
    nonNullable: true,
  });
  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });
  editForm = new FormGroup({ title: this.title, id: this.clipID });

  showAlert = false;
  alertMsg = 'Please wait! Updating clip';
  alertColor = 'blue';
  inSubmission = false;

  constructor(private modal: ModalService, private clipService: ClipService) {}

  ngOnChanges(): void {
    if (!this.activeClip) return;

    this.inSubmission = false;
    this.showAlert = false;
    this.clipID.setValue(this.activeClip.docID || '');
    this.title.setValue(this.activeClip.title);
  }

  ngOnInit(): void {
    this.modal.register('editClip');
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip');
  }

  async submit() {
    if (!this.activeClip) return;

    this.editForm.disable();

    this.inSubmission = true;
    this.showAlert = true;
    this.alertMsg = 'Please wait! Updating clip';
    this.alertColor = 'blue';

    try {
      await this.clipService.updateClip(this.clipID.value, this.title.value);
    } catch (error) {
      console.error(error);
      this.editForm.enable();
      this.inSubmission = false;
      this.alertMsg = 'Error, pls retry';
      this.alertColor = 'red';
      return;
    }

    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = 'Success! Your video has been updated!';
  }
}
