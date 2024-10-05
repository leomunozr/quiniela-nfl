import React from "react";
import styled from "styled-components";
import { Paper, Typography, Grid2, Stack } from "@mui/material";

// Styled component for the scoreboard container
const ScoreboardContainer = styled(Paper)`
  padding: 20px;
  margin: 20px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
`;

const Scoreboard = ({ competitions, date, status }) => {
  const [home, away] = competitions[0].competitors;

  return (
    <ScoreboardContainer elevation={3}>
      <Grid2 container alignItems="center" spacing={2} width="100%">
        <Grid2 container justifyContent="center" size={1}>
          <img src={home.team.logo} alt={home.team.displayName} height="40px" />
        </Grid2>
        <Grid2 size={4}>
          <Typography variant="body">{home.team.displayName}</Typography>
        </Grid2>

        <Grid2 container justifyContent="center" size={2}>
          <Stack alignItems="center">
            <Typography variant="h6">
              {home.score} - {away.score}
            </Typography>
            <Typography variant="body">{status.type.shortDetail}</Typography>
          </Stack>
        </Grid2>

        <Grid2 container justifyContent="flex-end" size={4}>
          <Typography variant="body">{away.team.displayName}</Typography>
        </Grid2>
        <Grid2 container justifyContent="center" size={1}>
          <img src={away.team.logo} alt={away.team.display} height="40px" />
        </Grid2>
      </Grid2>
    </ScoreboardContainer>
  );
};

export default Scoreboard;
