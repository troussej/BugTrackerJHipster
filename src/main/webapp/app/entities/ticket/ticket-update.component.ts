import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { ITicket, Ticket } from 'app/shared/model/ticket.model';
import { TicketService } from './ticket.service';
import { IProject } from 'app/shared/model/project.model';
import { ProjectService } from 'app/entities/project/project.service';
import { ILabel } from 'app/shared/model/label.model';
import { LabelService } from 'app/entities/label/label.service';

@Component({
  selector: 'jhi-ticket-update',
  templateUrl: './ticket-update.component.html'
})
export class TicketUpdateComponent implements OnInit {
  isSaving: boolean;

  projects: IProject[];

  labels: ILabel[];
  dueDateDp: any;

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required]],
    description: [],
    dueDate: [],
    done: [],
    project: [],
    labels: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected ticketService: TicketService,
    protected projectService: ProjectService,
    protected labelService: LabelService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ ticket }) => {
      this.updateForm(ticket);
    });
    this.projectService
      .query()
      .subscribe((res: HttpResponse<IProject[]>) => (this.projects = res.body), (res: HttpErrorResponse) => this.onError(res.message));
    this.labelService
      .query()
      .subscribe((res: HttpResponse<ILabel[]>) => (this.labels = res.body), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(ticket: ITicket) {
    this.editForm.patchValue({
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      dueDate: ticket.dueDate,
      done: ticket.done,
      project: ticket.project,
      labels: ticket.labels
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const ticket = this.createFromForm();
    if (ticket.id !== undefined) {
      this.subscribeToSaveResponse(this.ticketService.update(ticket));
    } else {
      this.subscribeToSaveResponse(this.ticketService.create(ticket));
    }
  }

  private createFromForm(): ITicket {
    return {
      ...new Ticket(),
      id: this.editForm.get(['id']).value,
      title: this.editForm.get(['title']).value,
      description: this.editForm.get(['description']).value,
      dueDate: this.editForm.get(['dueDate']).value,
      done: this.editForm.get(['done']).value,
      project: this.editForm.get(['project']).value,
      labels: this.editForm.get(['labels']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITicket>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackProjectById(index: number, item: IProject) {
    return item.id;
  }

  trackLabelById(index: number, item: ILabel) {
    return item.id;
  }

  getSelected(selectedVals: any[], option: any) {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
