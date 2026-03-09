import { IApplication, IJob } from "src/common";

export class JobResponse {
  job: IJob;
}

export class AllJobResponse {
  jobs: IJob[];
}

export class ApplicationResponse {
  application: IApplication;
}
