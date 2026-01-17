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
  Tooltip,
  Grid2,
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
    background: ${({ isSelected }) => (isSelected ? selectedColor : "white")};
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
  width: 30px;
`;

const TeamLogo = styled.img`
  width: 4em;
  height: 4em;

  @media (max-width: 600px) {
    width: 2em;
    height: 2em;
  }
`;

const ImgContainer = styled.div`
  padding: 10px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: scale(1.2);
  @media (max-width: 600px) {
    padding: 15px;
    transform: scale(1.8);
  }
`;

const PlayoffsRanking = ({ events }) => {
  const competitions = events.map((event) => event.competitions[0]);
  const competitors = competitions.flatMap(
    (competition) => competition.competitors,
  );

  const [selectedItem, setSelectedItem] = useState(null);

  const calculatePoints = () => {
    const puntosRonda = {};
    const pointsDetails = {};
    playersData.forEach((p) => {
      puntosRonda[p.nombre] = 0;
      pointsDetails[p.nombre] = {};
    });

    const currentCompetitions = competitions.filter(
      (competition) => competition.status.type.name !== "STATUS_SCHEDULED",
    );

    currentCompetitions.forEach((competition) => {
      const [home, away] = competition.competitors;
      const homeScore = parseInt(home.score);
      const awayScore = parseInt(away.score);
      let winnerName = null;
      if (home.winner) {
        winnerName = home.team.name.toLowerCase();
      } else if (away.winner) {
        winnerName = away.team.name.toLowerCase();
      } else if (homeScore > awayScore) {
        winnerName = home.team.name.toLowerCase();
      } else if (awayScore > homeScore) {
        winnerName = away.team.name.toLowerCase();
      }

      if (!winnerName) return;

      const matchPoints = {};

      let correctWinners = playersData
        .map((player) => {
          const homePrediction = player[home.team.name.toLowerCase()];
          const awayPrediction = player[away.team.name.toLowerCase()];
          const predWinner =
            homePrediction > awayPrediction
              ? home.team.name.toLowerCase()
              : awayPrediction > homePrediction
                ? away.team.name.toLowerCase()
                : null;

          if (predWinner === winnerName) {
            matchPoints[player.nombre] = 1; // Punto base
            return {
              nombre: player.nombre,
              homePrediction,
              awayPrediction,
              esExacto:
                homePrediction === homeScore && awayPrediction === awayScore,
              noSePaso:
                homePrediction <= homeScore && awayPrediction <= awayScore,
              diffTotal: Math.abs(
                homePrediction + awayPrediction - (homeScore + awayScore),
              ),
            };
          }
          return null;
        })
        .filter(Boolean);

      if (correctWinners.length === 0) return;

      // 2. Regla marcador exacto (+2 PE)
      const exactos = correctWinners.filter((c) => c.esExacto);
      if (exactos.length > 0) {
        exactos.forEach((c) => (matchPoints[c.nombre] += 2));
      }
      // 3. Regla cercanía sin pasarse (+1.5 PE)
      else {
        const sinPasarse = correctWinners.filter((c) => c.noSePaso);
        if (sinPasarse.length > 0) {
          const minDiff = Math.min(...sinPasarse.map((c) => c.diffTotal));
          sinPasarse
            .filter((c) => c.diffTotal === minDiff)
            .forEach((c) => (matchPoints[c.nombre] += 1.5));
        }
        // 4. Regla menor diferencia si todos se pasaron (+1 PE)
        else {
          const minDiff = Math.min(...correctWinners.map((c) => c.diffTotal));
          correctWinners
            .filter((c) => c.diffTotal === minDiff)
            .forEach((c) => (matchPoints[c.nombre] += 1));
        }
      }

      Object.keys(matchPoints).forEach((playerName) => {
        const pts = matchPoints[playerName];
        if (pts > 0) {
          puntosRonda[playerName] += pts;
          pointsDetails[playerName][home.team.name.toLowerCase()] = pts;
          pointsDetails[playerName][away.team.name.toLowerCase()] = pts;
        }
      });
    });

    return { totals: puntosRonda, details: pointsDetails };
  };

  const { totals: currentpuntosRonda, details: pointsDetails } =
    calculatePoints();

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
                <TableCell
                  padding="none"
                  key={team.name}
                  sx={{
                    background: `#${team.color}`,
                    opacity: 0.9,
                    borderRight:
                      index % 2 === 1 && index !== competitors.length - 1
                        ? "1px solid #e0e0e0"
                        : undefined,
                  }}
                >
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
              .map((n) => {
                const data = playersData.find((player) => player.nombre === n);
                if (data) {
                  const { nombre, timestamp, ...predictions } = data;
                  return { nombre, predictions };
                } else {
                  return {
                    nombre: n,
                    predictions: {},
                  };
                }
              })
              .map(({ nombre, predictions }) => (
                <HighlightedRow
                  key={nombre}
                  onClick={() => setSelectedItem(nombre)}
                  isSelected={selectedItem === nombre}
                >
                  <NameColumn>{nombre}</NameColumn>
                  {competitions.map((competition, index) => {
                    const [home, away] = competition.competitors;
                    const homeKey = home.team.shortDisplayName.toLowerCase();
                    const awayKey = away.team.shortDisplayName.toLowerCase();
                    const hasPredictions = Object.keys(predictions).length > 0;
                    const earnedPoints = pointsDetails[nombre]?.[homeKey];

                    return (
                      <ScoreCell
                        key={homeKey}
                        colSpan={2}
                        sx={{
                          borderRight:
                            index !== competitions.length - 1
                              ? "1px solid #e0e0e0"
                              : undefined,
                        }}
                      >
                        <Stack alignItems="center">
                          <Stack
                            direction="row"
                            justifyContent="space-around"
                            width="100%"
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold" }}
                            >
                              {hasPredictions ? predictions[homeKey] : "-"}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold" }}
                            >
                              {hasPredictions ? predictions[awayKey] : "-"}
                            </Typography>
                          </Stack>
                          {earnedPoints > 0 && (
                            <Typography
                              variant="caption"
                              color="success.main"
                              sx={{ fontWeight: "bold" }}
                            >
                              +{earnedPoints}
                            </Typography>
                          )}
                        </Stack>
                      </ScoreCell>
                    );
                  })}
                  <ResultColumn>
                    <Grid2 container spacing={1}>
                      <Tooltip title="Puntos acumulados" placement="top" enterTouchDelay={0}>
                        <MatchCount>
                          {points[nombre]}
                        </MatchCount>
                      </Tooltip>
                      <Tooltip title="Puntos ronda actual" placement="top" enterTouchDelay={0}>
                        <MatchCount>
                          {currentpuntosRonda[nombre] || 0}
                        </MatchCount>
                      </Tooltip>
                      <Tooltip title="Suma total de puntos" placement="top" enterTouchDelay={0}>
                        <MatchCount
                          hasMostWins={true}
                        >
                          {points[nombre] + (currentpuntosRonda[nombre] || 0)}
                        </MatchCount>
                      </Tooltip>
                    </Grid2>
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
