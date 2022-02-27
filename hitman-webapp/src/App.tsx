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
import React, { ReactElement, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { TimePicker } from "@mui/lab";

interface CeleryTaskUpdate {
  progress: number;
  status: string;
}

interface ScheduleCeleryTaskProps {
  onSubmitCallback: (date: Date | null, dayOfWeek: string[]) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function ScheduleCeleryTask({
  onSubmitCallback,
}: ScheduleCeleryTaskProps): ReactElement {
  const theme = useTheme();
  const [dateTimeValue, setDateTimeValue] = useState(null);
  const [dayOfWeek, setDayOfWeek] = React.useState<string[]>(["monday"]);

  const daysOfWeekArray: string[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
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
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              multiple
              value={dayOfWeek}
              onChange={(e) => {
                setDayOfWeek(
                  typeof e.target.value === "string"
                    ? e.target.value.split(",")
                    : e.target.value
                );
              }}
              input={<OutlinedInput label="Day" />}
              MenuProps={MenuProps}
            >
              {daysOfWeekArray.map((day) => (
                <MenuItem
                  key={day}
                  value={day}
                  style={getStyles(day, dayOfWeek, theme)}
                >
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              renderInput={(props) => <TextField {...props} />}
              ampm={false}
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
              onSubmitCallback(dateTimeValue, dayOfWeek);
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

  const onSubmitScheduledTask = (newDate: Date | null, dayOfWeek: string[]) => {
    if (newDate !== null) {
      fetch("http://localhost:8000/hitmen/schedule", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target_name: "Keanu Reeves",
          schedule_time: newDate,
          days_of_week: dayOfWeek,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
        });
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
