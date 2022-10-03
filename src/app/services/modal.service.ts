import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modals: IModal[] = [];

  constructor() {}

  isModalOpen(id: string): boolean {
    return !!this.modals.find((m) => m.id === id)?.visible;
  }

  toggleModal(id: string) {
    const modal = this.modals.find((m) => m.id === id) || {};
    if (!modal) return;

    this.modals = this.modals.map((m) => {
      if (m.id !== id) return m;

      return { ...m, visible: !m.visible };
    });
  }

  register(id: string) {
    this.modals.push({
      id,
      visible: false,
    });
  }

  unregister(id: string) {
    this.modals = this.modals.filter((m) => m.id !== id);
  }
}
