import styled from "styled-components";
import { Typography, Grid2, List, ListItem, Stack } from "@mui/material";

const TeamLogo = styled.img`
  width: 2em;
  height: 2em;
  background: url(http://wizzfree.com/pix/bg.jpg) fixed;
`;

const MatchCount = styled.div`
  background-color: ${(props) => (props.hasMostWins ? "#4caf50" : "lightgrey")};
  align-items: center;
  border-radius: 5px;
  color: white;
  display: flex;
  font-weight: bold;
  justify-content: center;
  margin-left: 5px;
  padding: 5px;
`;

const PlayerScore = ({ hasMostWins, name, teams, wins }) => {
  return (
    <Grid2 container width="100%" alignItems="center">
      <Grid2 size={{ xs: 2 }}>
        <Typography fontWeight="bold" variant="caption">
          {name}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 9 }}>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          overflow="auto"
          spacing={3}
        >
          {teams?.map((team, index) => (
            <TeamLogo
              key={`team-logo-${index}`}
              src={team.logo}
              alt={team.shortDisplayName}
              title={team.shortDisplayName}
              winner={team.isWinner}
            />
          ))}
        </Stack>
      </Grid2>
      <Grid2 size={1}>
        <MatchCount hasMostWins={hasMostWins}>{wins || "-"}</MatchCount>
      </Grid2>
    </Grid2>
  );
};

export default PlayerScore;
