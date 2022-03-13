import { ReactElement } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { Box, Typography, Button } from "@mui/material";

interface CeleryTaskProgressBarProps {
  progressValue: number;
}

interface StartCeleryTaskButtonProps {
  onClickCallback: () => void;
}

export function StartCeleryTaskButton({
  onClickCallback,
}: StartCeleryTaskButtonProps): ReactElement {
  return (
    <Box
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Button onClick={onClickCallback}>Start Task</Button>
    </Box>
  );
}

export function CeleryTaskProgressBar({
  progressValue,
}: CeleryTaskProgressBarProps): ReactElement {
  return (
    <Box
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box sx={{ width: "400px", mr: 1 }}>
        <LinearProgress variant="determinate" value={progressValue} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          progressValue
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
