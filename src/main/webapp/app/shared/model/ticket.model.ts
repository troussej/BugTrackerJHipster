import { Moment } from 'moment';
import { IProject } from 'app/shared/model/project.model';
import { ILabel } from 'app/shared/model/label.model';
import { IUser } from 'app/core/user/user.model';

export interface ITicket {
  id?: number;
  title?: string;
  description?: string;
  dueDate?: Moment;
  done?: boolean;
  project?: IProject;
  labels?: ILabel[];
  assignedTos?: IUser[];
}

export class Ticket implements ITicket {
  constructor(
    public id?: number,
    public title?: string,
    public description?: string,
    public dueDate?: Moment,
    public done?: boolean,
    public project?: IProject,
    public labels?: ILabel[],
    public assignedTos?: IUser[]
  ) {
    this.done = this.done || false;
  }
}
