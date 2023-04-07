/**
 * Module contains implementation of ProcessDataComponent. This button is used to process data.
 * 
 * @module Process Data Component
 */

import { ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Component } from '@angular/core';
import { Canvas } from '../../canvas';
import { CanvasManagerInterface, ShapeToCreateEnum } from '../../canvas-manager-interface';
import { DependenciesPresenter } from '../../dependencies-presenter/dependencies-presenter';
import { display_processed_data } from '../../dependencies-presenter/display_processed_data';

@Component({
  selector: 'app-process-data',
  template: `
  <input type="image" class="icon-button" src="/static/imgs/ProcessIcon.svg" (click)="isTrue() && onClick();" alt="Process Sketch">

  <ng-template #modalData let-modal>
  <div class="modal-header modal-title">Waiting For Answear</div>
  <div class="modal-body" style="display: flex; justify-content: center; background-color: #EBEBEB;">
    <div class="loader"></div>
  </div>
  </ng-template>
  `,
  styleUrls: ['./../../dashboard.component.css']
})
export class ProcessDataComponent {
  /** 
   * Function used in process-data.component template.
   * Check if it is currently not possible drawing some shape.
   * @ignore */
  public isTrue() {
    return Canvas.getCurrentyCreatedShape() == ShapeToCreateEnum.NONE;
  }

  /** 
   * Variable used in process-data.component template.
   * @ignore */
  @ViewChild("modalData", { static: false }) content: any;

  /**
   * Initializing ModalService.
   * @param modalService instance of ModalService
   */
  constructor(private modalService: NgbModal) { }

  /**
   * Function called after clicked on this component(button).
   * Start processing data and call triggerModal.
   */
  public onClick() {
    this.triggerModal(this.content);
    Canvas.lockUI();

    const json = CanvasManagerInterface.getJsonData();
    //console.log(json);

    (async () => {
      try {
        const rawResponse = await fetch('http://localhost:8787/compute', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'text/plain'
          },
          body: JSON.stringify({ json })
        });
        const content = await rawResponse.json();
        //console.log(content);

        DependenciesPresenter.presentDependencies(content);

        let new_window = window.open('', '_blank');
        new_window!.document.write(display_processed_data(content, Canvas.pointNames));
      }
      catch { alert("PROCESSING FAILED!") }
      finally {
        this.closeModal();
        Canvas.unlockUI();
      }
    })();
  }

  /**
   * Function called after start processing data.
   * Information about process of processing data.
   * @param content element with a information to display
   */
  triggerModal(content: any) {
    this.modalService.open(content, { centered: true, keyboard: false, backdrop: 'static' }).result.then(
      (res) => { }, (res) => { });
  }

  closeModal() {
    this.modalService.dismissAll();

  }
}
