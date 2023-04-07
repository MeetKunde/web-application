/**
 * Module contains implementation of SaveSchemeComponent. This button is used to save current scheme.
 * 
 * @module Save Scheme Component
 */

import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SchemeService } from 'src/app/services/scheme.service';
import { Canvas } from '../../canvas';
import { CanvasManagerInterface, ShapeToCreateEnum } from '../../canvas-manager-interface';

@Component({
  selector: 'app-save-scheme',
  template: `
  <input type="image" class="icon-button" src="/static/imgs/SaveIcon.svg" (click)="isTrue() && onClick();" alt="Save Scheme">

  <ng-template #modalData let-modal>
  <div class="modal-header modal-title">Enter Saving Scheme Name</div>
  <div class="modal-body" style="display: flex; justify-content: center; background-color: #EBEBEB;">
    <div class="row" style="display: flex; justify-content: center;">
      <input [(ngModel)]="schemeTitle" class="form-control" id="scheme-title" placeholder="Enter Scheme Name">
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec1')">Save Scheme</button>
    </div>
  </div>
  </ng-template>
  `,
  styleUrls: ['./../../dashboard.component.css']
})
export class SaveSchemeComponent {
  /** 
   * Variable used in set-length.component template.
   * @ignore */
  @ViewChild("modalData", { static: false }) content: any;

  /**
   * Variable used to get information from modal.
   * @ignore */
   schemeTitle: string = "";

  /** 
   * Function used in save-scheme.component template.
   * Check if it is currently not possible drawing some shape.
   * @ignore */
  public isTrue() {
    return Canvas.getCurrentyCreatedShape() == ShapeToCreateEnum.NONE;
  }

  constructor(private modalService: NgbModal, private toastrService: ToastrService, private schemeService: SchemeService) { }

  /**
   * Function called after clicked on this component(button).
   */
  onClick(): void {
    this.triggerModal(this.content);
  }

  triggerModal(content: any) {
    this.modalService.open(content, { centered: true }).result.then(
      (res) => { }, (res) => {
        if (res == "dec1") {
          this.schemeService.create({ title: this.schemeTitle, body: JSON.stringify(CanvasManagerInterface.getJsonData()) }).subscribe(
            () => { this.toastrService.success("Successfully saved the scheme!", "", { timeOut: 3000, progressBar: false }); },
            () => { this.toastrService.success("Failed to save the scheme", "", { timeOut: 3000, progressBar: false }); }
          );
        }
      });
  }
}

