import React from "react";
import styled from "@mui/material/styles/styled";
import { Paper, Typography, Grid2, Stack, Box } from "@mui/material";
import { END_PERIOD, FINAL, IN_PROGRESS, SCHEDULED } from "../constants";

const ScoreboardContainer = styled(Paper)`
  padding: 1rem 0.8rem;
  margin: 1.2rem 0.5rem;
  background-color: ${({ final }) => (final ? "#bebebe" : "#f5f5f5")};
  box-shadow: ${({ playing }) => (playing ? "0 0 3px #8BD6A4" : "none")};
  display: flex;
  align-items: center;
  filter: ${({ final }) => (final ? "opacity(50%)" : "")};
`;

const ScoreSection = styled(Grid2)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ScoreAndClock = styled(Stack)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BallIcon = styled(Box)`
  font-size: 10px;
  padding: 0 5px;
  margin-left: 0;
  margin-right: 0;
`;

const GameDate = ({ date }) => {
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

const GameClock = ({ detail }) => {
  const [clock, quarter] = detail.split(" - ");
  return (
    <Stack alignItems="center" display="flex" justifyContent="center" mt={1}>
      <Typography textAlign="center" variant="caption">
        {clock}
      </Typography>
      <Typography textAlign="center" variant="caption">
        {quarter}
      </Typography>
    </Stack>
  );
};

const Scoreboard = ({ competitions, date, status }) => {
  const [home, away] = competitions[0].competitors;
  const d = new Date(date);
  const gameStatus = status.type.name;

  const hasTheBall = (teamId) => competitions[0]?.situation?.possession === teamId ? <BallIcon>🏈</BallIcon> : null;

  return (
    <ScoreboardContainer
      elevation={3}
      final={gameStatus === FINAL}
      playing={gameStatus === IN_PROGRESS || gameStatus === END_PERIOD}
    >
      <Grid2 container width={"100%"}>
        <Grid2 size={5} display="flex">
          <Stack direction="row" spacing={1} alignItems="center">
            <img
              src={home.team.logo}
              alt={home.team.displayName}
              height="40px"
            />
            <Stack>
              <Typography variant="caption">{home.team.displayName}</Typography>
              <Typography variant="caption">
                ({home.records?.[0].summary})
              </Typography>
            </Stack>
            {hasTheBall(home.id)}
          </Stack>
        </Grid2>

        <ScoreSection size={2}>
          <ScoreAndClock>
            <Typography fontWeight="bold" variant="body">
              {home.score} - {away.score}
            </Typography>
            {gameStatus === SCHEDULED ? (
              <GameDate date={d} />
            ) : (
              <GameClock detail={status.type.shortDetail} />
            )}
          </ScoreAndClock>
        </ScoreSection>

        <Grid2 size={5} display="flex" justifyContent="flex-end">
          <Stack direction="row" spacing={1} alignItems="center">
            {hasTheBall(away.id)}
            <Stack>
              <Typography variant="caption" textAlign="right">
                {away.team.displayName}
              </Typography>
              <Typography variant="caption" textAlign="right">
                ({away.records?.[0].summary})
              </Typography>
            </Stack>
            <img src={away.team.logo} alt={away.team.display} height="40px" />
          </Stack>
        </Grid2>
      </Grid2>
    </ScoreboardContainer>
  );
};

export default Scoreboard;
