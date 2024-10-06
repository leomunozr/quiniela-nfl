import styled from "styled-components";
import { Stack } from "@mui/material";

const TeamLogo = styled.img`
  width: 2em;
  height: 2em;
  background: url(http://wizzfree.com/pix/bg.jpg) fixed;
`;

const Cross = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  font-size: 1.5em;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImgContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PlayerScore = ({ teams }) => {
  return (
    <Stack
      alignItems="center"
      direction="row"
      justifyContent="space-between"
      spacing={3}
    >
      {teams?.map((team, index) => (
        <ImgContainer key={`logo-${index}`}>
          <TeamLogo
            key={`team-logo-${index}`}
            src={team.logo}
            alt={team.shortDisplayName}
            title={team.shortDisplayName}
            loser={team.isLoser}
          />
          {team.isLoser ? <Cross>💀</Cross> : null}
        </ImgContainer>
      ))}
    </Stack>
  );
};

export default PlayerScore;
