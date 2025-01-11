import { useState } from "react";
import styled from "styled-components";
import styledMui from "@mui/material/styles/styled";
import {
  Typography,
  Paper,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  TableBody,
  TableCell,
} from "@mui/material";

import playersData from "../data/playersData";

const hoverColor = "#e0e0e0";
const selectedColor = "#e3f2fd";

const StyledPaper = styledMui(Paper)`
  padding: 1rem;
`;

const HighlightedRow = styled(TableRow)`
  & > * {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    background: ${({ isSelected }) =>
    isSelected ? selectedColor : "white"};
    transition: background-color 0.3s ease;
  }
  &:hover {
    background: ${hoverColor};
  }
`;

const NameColumn = styledMui(TableCell)`
  background: white;
  left: 0;
  padding: 0.5rem 0;
  position: sticky;
  z-index: 1;
`;

const ScoreCell = styledMui(TableCell)`
  font-weight: bold;
  text-align: center;
`;

const ResultColumn = styledMui(TableCell)`
  background: white;
  padding: 0.5rem 0 0.5rem 0.1rem;
  position: sticky;
  right: 0;
  z-index: 1;
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

const TeamLogo = styled.img`
  width: 3em;
  height: 3em;
`;

const ImgContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PlayoffsRanking = ({ events }) => {
  const competitions = events.map((event) => event.competitions[0]);
  const competitors = competitions.map((competition) => competition.competitors).flat();

  const [selectedItem, setSelectedItem] = useState(null);
  const handleItemClick = (name) => {
    selectedItem === name ? setSelectedItem("") : setSelectedItem(name);
  };

  const calculatePoints = (predictions) => {
    const points = 0;
    const currentCompetitions = competitions.filter((competition) => competition.status.type.name !== "STATUS_SCHEDULED");

    currentCompetitions.map((competition) => {
      const winner = getCompetitionWinner(competition);
      const [home, away] = competition.competitors;
      const homeScorePrediction = predictions[home.team.name.toLowerCase()];
      const awayScorePrediction = predictions[away.team.name.toLowerCase()];
      const esGanador = getPredictionWinner(winner, homeScorePrediction, awayScorePrediction);
      const esMarcadorExacto = homeScorePrediction === parseInt(home.score) && awayScorePrediction === parseInt(away.score);

      if (!esGanador) return;

      points += 1;

      if (esMarcadorExacto) {
        points += 2;
      }

      // else if (esMasCercanoSinPasarse) {
      //   points += 1.5;
      // } 

      // else if (esMasCercanoPasandose) {
      //   points += 1;
      // }
    });
    return points;
  }

  function getCompetitionWinner(competition) {
    const [home, away] = competition.competitors;
    home.score = '10';
    away.score = '20';
    const max = Math.max(parseInt(home.score), parseInt(away.score));
    const winner = competition.competitors.find(competitor => parseInt(competitor.score) === max);
    return winner;
  }

  function getPredictionWinner(winner, homeScore, awayScore) {
    const predictionWinner = homeScore > awayScore ? 'home' : 'away';
    return winner.homeAway === predictionWinner;
  }

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h6" gutterBottom>
        Posiciones
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <HighlightedRow>
              <TableCell></TableCell>
              {competitors.map(({ team }) => (
                <TableCell key={team.name}>
                  <ImgContainer>
                    <TeamLogo
                      src={team.logo}
                      alt={team.shortDisplayName}
                      title={team.shortDisplayName}
                    />
                  </ImgContainer>
                </TableCell>
              ))}
              <TableCell></TableCell>
            </HighlightedRow>
          </TableHead>
          <TableBody>
            {playersData.map(({ nombre, timestamp, ...predictions }) => (
              <HighlightedRow key={nombre}
                onClick={() => handleItemClick(nombre)}
                isSelected={selectedItem === nombre}>
                <NameColumn>{nombre}</NameColumn>
                {Object.entries(predictions).map(([team, score]) => (
                  <ScoreCell key={team}>{score}</ScoreCell>
                ))}
                <ResultColumn>
                  <MatchCount hasMostWins={true}>
                    {calculatePoints(predictions)}
                  </MatchCount></ResultColumn>
              </HighlightedRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledPaper>
  );
};

export default PlayoffsRanking;