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
  width: 3em;
  height: 3em;
`;

const ImgContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: scale(1.5);
`;

const PlayoffsRanking = ({ events }) => {
  const competitions = events.map((event) => event.competitions[0]);
  const competitors = competitions.flatMap((competition) => competition.competitors);

  const [selectedItem, setSelectedItem] = useState(null);

  const calculatePoints = () => {
    const puntosRonda = {};
    playersData.forEach(p => puntosRonda[p.nombre] = 0);

    const currentCompetitions = competitions.filter(
      (competition) => competition.status.type.name !== "STATUS_SCHEDULED"
    );

    currentCompetitions.forEach((competition) => {
      const [home, away] = competition.competitors;
      const homeScore = parseInt(home.score);
      const awayScore = parseInt(away.score);
      const winnerName = home.winner ? home.team.name.toLowerCase() : away.team.name.toLowerCase();

      let correctWinners = playersData.map(player => {
        const homePrediction = player[home.team.name.toLowerCase()];
        const awayPrediction = player[away.team.name.toLowerCase()];
        const predWinner = homePrediction > awayPrediction ? home.team.name.toLowerCase() : away.team.name.toLowerCase();

        if (predWinner === winnerName) {
          puntosRonda[player.nombre] += 1; // Punto base
          return {
            nombre: player.nombre,
            homePrediction, awayPrediction,
            esExacto: homePrediction === homeScore && awayPrediction === awayScore,
            noSePaso: homePrediction <= homeScore && awayPrediction <= awayScore,
            diffTotal: Math.abs((homePrediction + awayPrediction) - (homeScore + awayScore))
          };
        }
        return null;
      }).filter(Boolean);

      if (correctWinners.length === 0) return;

      // 2. Regla marcador exacto (+2 PE)
      const exactos = correctWinners.filter(c => c.esExacto);
      if (exactos.length > 0) {
        exactos.forEach(c => puntosRonda[c.nombre] += 2);
        return; // Si hay exactos, se saltan las demás reglas de PE
      }

      // 3. Regla cercanía sin pasarse (+1.5 PE)
      const sinPasarse = correctWinners.filter(c => c.noSePaso);
      if (sinPasarse.length > 0) {
        const minDiff = Math.min(...sinPasarse.map(c => c.diffTotal));
        sinPasarse.filter(c => c.diffTotal === minDiff)
          .forEach(c => puntosRonda[c.nombre] += 1.5);
      }
      // 4. Regla menor diferencia si todos se pasaron (+1 PE)
      else {
        const minDiff = Math.min(...correctWinners.map(c => c.diffTotal));
        correctWinners.filter(c => c.diffTotal === minDiff)
          .forEach(c => puntosRonda[c.nombre] += 1);
      }
    });

    return puntosRonda;
  };

  const currentpuntosRonda = calculatePoints();

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
                  {competitors.map(({ team }, index) => (
                    <ScoreCell
                      key={team.shortDisplayName.toLowerCase()}
                      sx={
                        index % 2 === 1 && index !== competitors.length - 1
                          ? { borderRight: "1px solid #e0e0e0" }
                          : {}
                      }
                    >
                      {Object.keys(predictions).length > 0
                        ? predictions[team.shortDisplayName.toLowerCase()]
                        : "-"}
                    </ScoreCell>
                  ))}
                  <ResultColumn>
                    <Stack direction="row" spacing={1}>
                      <MatchCount title="Puntos acumulados">{points[nombre]}</MatchCount>
                      <MatchCount title="Puntos ronda actual">{currentpuntosRonda[nombre] || 0}</MatchCount>
                      <MatchCount title="Suma total de puntos" hasMostWins={true}>
                        {points[nombre] + (currentpuntosRonda[nombre] || 0)}
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
