import { axiosAuthInstance } from "../authentication/auth";

export function startNewHitJob() {
  const url = "hitmen/start-job";
  const request = axiosAuthInstance.post(
    url,
    {
      target_name: "Keanu Reeves",
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return request;
}
