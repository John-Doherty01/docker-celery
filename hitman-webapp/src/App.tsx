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
import { ReactElement, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { TimePicker } from "@mui/lab";

interface CeleryTaskUpdate {
  progress: number;
  status: string;
}

interface ScheduleCeleryTaskProps {
  onSubmitCallback: (date: Date | null) => void;
}

function ScheduleCeleryTask({
  onSubmitCallback,
}: ScheduleCeleryTaskProps): ReactElement {
  const [dateTimeValue, setDateTimeValue] = useState(null);
  const [dayOfWeek, setDayOfWeek] = useState("monday");
  return (
    <Box
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Schedule Celery Task
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Setup weekly schedule.
          </Typography>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Day</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={dayOfWeek}
              label="Day"
              onChange={(e) => {
                setDayOfWeek(e.target.value);
              }}
              style={{ minWidth: "200px" }}
            >
              <MenuItem value={"monday"}>Monday</MenuItem>
              <MenuItem value={"tuesday"}>Tuesday</MenuItem>
              <MenuItem value={"wednesday"}>Wednesday</MenuItem>
              <MenuItem value={"thursday"}>Thursday</MenuItem>
              <MenuItem value={"friday"}>Friday</MenuItem>
              <MenuItem value={"saturday"}>Saturday</MenuItem>
              <MenuItem value={"sunday"}>Sunday</MenuItem>
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              renderInput={(props) => <TextField {...props} />}
              label="Execution time"
              value={dateTimeValue}
              onChange={(newValue) => {
                setDateTimeValue(newValue);
              }}
            />
          </LocalizationProvider>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            onClick={() => {
              onSubmitCallback(dateTimeValue);
            }}
          >
            Submit
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
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

  const onSubmitScheduledTask = (newDate: Date | null) => {
    if (newDate !== null) {
      console.log(newDate);
    }
  };

  return (
    <div>
      <AppNavbar app_name="Hitman" />
      <div style={{ margin: "20px" }}>
        <CeleryTaskProgressBar progressValue={progressValue} />
        <StartCeleryTaskButton onClickCallback={CreateCeleryTask} />
      </div>
      <ScheduleCeleryTask onSubmitCallback={onSubmitScheduledTask} />
    </div>
  );
}

export default App;
