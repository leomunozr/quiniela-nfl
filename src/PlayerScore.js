import styled from "styled-components";
import { Typography, Grid2 } from "@mui/material";

const TeamLogo = styled.img`
  width: 40px;
  height: 40px;
  background: url(http://wizzfree.com/pix/bg.jpg) fixed;
`;

const MatchCount = styled.div`
  background-color: ${(props) => (props.hasMostWins ? "#4caf50" : "lightgrey")};
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
`;

const PlayerScore = ({ hasMostWins, name, teams, wins }) => {
  return (
    <Grid2 container width="100%" alignItems="center">
      <Grid2 size={{ xs: 2 }}>
        <Typography fontWeight="bold">{name}</Typography>
      </Grid2>

      <Grid2
        container
        alignItems="center"
        spacing={3}
        size={{ xs: 10 }}
        justifyContent="space-between"
      >
        {teams?.map((team, index) => (
          <TeamLogo
            key={`team-logo-${index}`}
            src={team.logo}
            alt={team.name}
            title={team.name}
            winner={team.isWinner}
          />
        ))}
        <MatchCount hasMostWins={hasMostWins}>{wins || "-"}</MatchCount>
      </Grid2>
    </Grid2>
  );
};

export default PlayerScore;
