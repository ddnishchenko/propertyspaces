import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'propertyspaces-contact-info-modal',
  templateUrl: './contact-info-modal.component.html',
  styleUrls: ['./contact-info-modal.component.scss']
})
export class ContactInfoModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  submit() {}
}
