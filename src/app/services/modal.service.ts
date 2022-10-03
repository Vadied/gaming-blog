import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private visibile = false;

  constructor() {}

  isModalOpen() {
    return this.visibile;
  }

  toggleModal() {
    this.visibile = !this.visibile;
  }
}
