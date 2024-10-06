import React from "react";
import styled from "@mui/material/styles/styled";
import { Paper, Typography, Grid2, Stack } from "@mui/material";

// Styled component for the scoreboard container
const ScoreboardContainer = styled(Paper)`
  padding: 1rem;
  margin: 1.2rem 1rem;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
`;

const Score = styled(Grid2)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const getDate = (date) => {
  const [days, hours] = date
    .toLocaleDateString("es-mx", {
      day: "numeric",
      month: "numeric",
      hour: "2-digit",
      minute: "numeric",
      hour12: false,
    })
    .split(",");

  return (
    <Stack alignItems="center" display="flex" justifyContent="center" mt={1}>
      <Typography variant="caption">{days}</Typography>
      <Typography variant="caption">{hours}</Typography>
    </Stack>
  );
};

const Scoreboard = ({ competitions, date, status }) => {
  const [home, away] = competitions[0].competitors;
  const d = new Date(date);

  return (
    <ScoreboardContainer elevation={3}>
      <Grid2 container width={"100%"}>
        <Grid2 size={5} display="flex">
          <Stack direction="row" spacing={1} alignItems="center">
            <img
              src={home.team.logo}
              alt={home.team.displayName}
              height="40px"
            />
            <Typography variant="caption">{home.team.displayName}</Typography>
          </Stack>
        </Grid2>
        <Score size={2}>
          <Stack>
            <Typography fontWeight="bold" variant="body">
              {home.score} - {away.score}
            </Typography>
            {status.type.name === "STATUS_SCHEDULED" ? (
              getDate(d)
            ) : (
              <Typography variant="caption">
                {status.type.shortDetail}
              </Typography>
            )}
          </Stack>
        </Score>

        <Grid2 size={5} display="flex" justifyContent="flex-end">
          <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" textAlign="right">
                {away.team.displayName}
              </Typography>
              <img src={away.team.logo} alt={away.team.display} height="40px" />
            </Stack>
          </Grid2>
        </Grid2>
      </ScoreboardContainer>
  );
};

export default Scoreboard;
