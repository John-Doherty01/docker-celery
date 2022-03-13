import { AxiosInstance, AxiosResponse } from "axios";

export class ApiService {
  axiosAuthInstance: AxiosInstance;

  constructor(axiosAuthInstance: AxiosInstance) {
    this.axiosAuthInstance = axiosAuthInstance;
  }

  startNewHitJob(targetName: string): Promise<AxiosResponse<any>> {
    const url = "hitmen/start-job";
    return this.axiosAuthInstance.post(
      url,
      {
        target_name: targetName,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
