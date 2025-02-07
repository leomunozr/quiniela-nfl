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
  Stack,
} from "@mui/material";

import playersData from "../data/playersData";
import { points } from "../data/acc";

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

  const calculatePoints = (predictions, nombre) => {
    let points = 0;
    const currentCompetitions = competitions.filter((competition) => competition.status.type.name !== "STATUS_SCHEDULED");

    currentCompetitions.forEach((competition) => {
      const [home, away] = competition.competitors;
      const winner = getCompetitionWinner(competition);
      const homeScorePrediction = predictions[home.team.name.toLowerCase()];
      const awayScorePrediction = predictions[away.team.name.toLowerCase()];
      const esGanador = getPredictionWinner(winner, homeScorePrediction, awayScorePrediction);

      if (!esGanador) return;

      const esMarcadorExacto = homeScorePrediction === parseInt(home.score) && awayScorePrediction === parseInt(away.score);
      const esMasCercanoSinPasarse = getMasCercanoSinPasarse(competition, winner, nombre, homeScorePrediction, awayScorePrediction);
      const esMasCercanoPasandose = getMasCercanoPasandose(competition, winner, nombre);

      points += 1;
      console.log({ nombre, esMarcadorExacto, esMasCercanoSinPasarse, esMasCercanoPasandose });
      if (esMarcadorExacto) {
        points += 2;
      }
      else if (esMasCercanoSinPasarse) {
        points += 1.5;
      }
      else if (esMasCercanoPasandose) {
        points += 1;
      }
    });
    return points;
  }

  function getMasCercanoPasandose(competition, winner, nombre) {
    const [home, away] = competition.competitors;
    const homeScore = parseInt(home.score);
    const awayScore = parseInt(away.score);

    const getDiff = getAbsCompetitionDiff(homeScore, awayScore)

    const diffs = playersData.map(({ nombre, timestamp, ...predictions }) => {
      const h = predictions[home.team.name.toLowerCase()];
      const a = predictions[away.team.name.toLowerCase()];
      const winnerPrediction = h > a ? home : away;
      if (winnerPrediction.team.name !== winner.team.name) return null;
      return { nombre, diff: getDiff(h, a) };
    });
    const minDiff = Math.min(...diffs.filter(d => d).map(d => d.diff));
    const cercanos = diffs.filter(d => d).filter(d => d.diff === minDiff)?.map(d => d.nombre);
    return cercanos.includes(nombre)
  }

  function getMasCercanoSinPasarse(competition, winner, nombre, homeScorePrediction, awayScorePrediction) {
    const [home, away] = competition.competitors;
    const homeScore = parseInt(home.score);
    const awayScore = parseInt(away.score);

    if (parseInt(home.score) < homeScorePrediction || parseInt(away.score) < awayScorePrediction) return false;

    const getDiff = getCompetitionDiff(homeScore, awayScore)

    const diffs = playersData.map(({ nombre, timestamp, ...predictions }) => {
      const h = predictions[home.team.name.toLowerCase()];
      const a = predictions[away.team.name.toLowerCase()];
      const winnerPrediction = h > a ? home : away;
      if (winnerPrediction.team.name !== winner.team.name) return null;
      return { nombre, diff: getDiff(h, a) };
    });
    const minDiff = Math.min(...diffs.filter(d => d).map(d => d.diff));
    const cercanos = diffs.filter(d => d).filter(d => d.diff === minDiff)?.map(d => d.nombre);
    return cercanos.includes(nombre)
  }

  const getCompetitionDiff = (homeScore, awayScore) => (homePrediction, awayPrediction) => {
    const homeDiff = homeScore - homePrediction;
    const awayDiff = awayScore - awayPrediction;
    return homeDiff + awayDiff;
  }

  const getAbsCompetitionDiff = (homeScore, awayScore) => (homePrediction, awayPrediction) => {
    const homeDiff = Math.abs(homeScore - homePrediction);
    const awayDiff = Math.abs(awayScore - awayPrediction);
    return homeDiff + awayDiff;
  }

  function getCompetitionWinner(competition) {
    const [home, away] = competition.competitors;
    const homeScore = parseInt(home.score);
    const awayScore = parseInt(away.score);
    if (homeScore === awayScore) return null;
    return homeScore > awayScore ? home : away;
  }

  function getPredictionWinner(winner, homeScore, awayScore) {
    if (!winner || !homeScore || !awayScore) return false;
    const predictionWinner = homeScore > awayScore ? 'home' : 'away';
    return winner.homeAway === predictionWinner;
  }

  const getAcc = (name) => points[name];

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h6" gutterBottom>
        Posiciones
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <HighlightedRow>
              <NameColumn></NameColumn>
              {competitors.map(({ team }, index) => (
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
              <ResultColumn></ResultColumn>
            </HighlightedRow>
          </TableHead>
          <TableBody>
            {Object.keys(points)
              .map(n => {
                const data = playersData.find(player => player.nombre === n)
                if (data) {
                  const { nombre, timestamp, ...predictions } = data;
                  return { nombre, predictions }
                } else {
                  return ({
                    nombre: n,
                    predictions: {}
                  })
                }
              })
              .map(({ nombre, predictions }) => (
                <HighlightedRow key={nombre}
                  onClick={() => handleItemClick(nombre)}
                  isSelected={selectedItem === nombre}>
                  <NameColumn>{nombre}</NameColumn>
                  {
                    Object.entries(predictions).length > 0 ?
                      competitors.map(({ team }) => (
                        <ScoreCell key={team.shortDisplayName.toLowerCase()}>{predictions[team.shortDisplayName.toLowerCase()]}</ScoreCell>
                      )) : [...Array(competitors.length)].map((_, index) => (
                        <ScoreCell key={`empty-${index}`}>-</ScoreCell>
                      ))
                  }
                  <ResultColumn>
                    <Stack direction="row" spacing={1}>
                      <MatchCount>
                        {getAcc(nombre)}
                      </MatchCount>
                      <MatchCount hasMostWins={true}>
                        {calculatePoints(predictions, nombre)}
                      </MatchCount>
                    </Stack>
                  </ResultColumn>
                </HighlightedRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledPaper>
  );
};

export default PlayoffsRanking;