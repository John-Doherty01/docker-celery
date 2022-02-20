import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { AppNavbar } from "./navbar/navbar";
import {
  CeleryTaskProgressBar,
  StartCeleryTaskButton,
} from "./celery-task-progress-bar/progress-bar";
import { useState } from "react";

interface CeleryTaskUpdate {
  progress: number;
  status: string;
}

function App() {
  const [progressValue, setProgressValue] = useState(0);
  const CreateCeleryTask = () => {
    fetch("http://localhost:8000/hitmen/start-job", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target_name: "Keanu Reeves",
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const socket = new WebSocket(
          `ws://localhost:8000/task/progress/${data.celery_task_id}/`
        );
        socket.onmessage = (event) => {
          const parsedEvent: CeleryTaskUpdate = JSON.parse(event.data);
          console.log(parsedEvent);
          setProgressValue(parsedEvent.progress * 100);
        };

        socket.onerror = (err) => {
          console.log(err);
        };
        socket.onclose = (event) => {
          console.log(event);
        };
        socket.onopen = (event) => {
          console.log(event);
        };
      });
  };

  return (
    <div>
      <AppNavbar app_name="Hitman" />
      <div style={{ marginTop: "20px" }}>
        <CeleryTaskProgressBar progressValue={progressValue} />
        <StartCeleryTaskButton onClickCallback={CreateCeleryTask} />
      </div>
    </div>
  );
}

export default App;
