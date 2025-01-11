import { useCallback, useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {
  Grid2,
  Paper,
  styled,
  Table,
  TableCell,
  TableRow,
} from "@mui/material";

import PlayoffsRanking from "./components/PlayoffsRanking";
import RankedList from "./components/RankedList";
import Scoreboard from "./components/Scoreboard";
import { SCOREBOARD_API, WEDNESDAY } from "./constants";

import playersRawData from "./data/playersData";
import teamsData from "./data/teams";
import fireworks from "./fireworks";

const IS_PLAYOFFS = true

const ContainerStyled = styled(Container)`
  padding-left: 0;
  padding-right: 0;
`;

const daysToNotShowPositions = [];

function App() {
  const [events, setEvents] = useState([]);
  const [playersData, setPlayersData] = useState([]);
  const [week, setWeek] = useState("");
  const [winners, setWinners] = useState([]);
  const [losers, setLosers] = useState([]);
  const [draftWinners, setDrafWinners] = useState([])

  const getLogo = (shortDisplayName) => {
    const found = teamsData?.filter(
      (item) => item?.team?.shortDisplayName === shortDisplayName
    );
    return found?.[0]?.team?.logos?.[0]?.href;
  };

  const isLoser = useCallback(
    (shortDisplayName) => {
      const loser = losers?.find(
        (loser) => loser?.team?.shortDisplayName === shortDisplayName
      );
      return loser?.team?.shortDisplayName === shortDisplayName;
    },
    [losers]
  );

  const isWinner = useCallback(
    (shortDisplayName) => {
      const winner = winners?.find(
        (winner) => winner?.team?.shortDisplayName === shortDisplayName
      );
      return winner?.team?.shortDisplayName === shortDisplayName;
    },
    [winners]
  );

  const isDraftWinner = useCallback(
    (shortDisplayName) => {
      const winner = draftWinners?.find(
        (winner) => winner?.team?.shortDisplayName === shortDisplayName
      );
      return winner?.team?.shortDisplayName === shortDisplayName;
    },
    [draftWinners]
  );

  const getLosers = (events) =>
    events?.reduce((acc, event) => {
      const game = event.competitions[0];
      if (game.status.type.name === "STATUS_FINAL") {
        const loser = game.competitors?.filter(
          (competitor) => !competitor?.winner
        );
        return [...acc, ...loser];
      }
      return acc;
    }, []);

  const getWinners = (events) =>
    events?.reduce((acc, event) => {
      const winners = event?.competitions?.[0]?.competitors?.filter(
        (competitor) => competitor?.winner
      );
      return [...acc, ...winners];
    }, []);

  const getDraftWinners = (events) => {
    const draftWinners = []
    events?.forEach((event) => {
      const game = event.competitions[0]
      if (game.status.type.name !== "STATUS_FINAL") {
        const [home, away] = event?.competitions?.[0]?.competitors
        if (home.score !== away.score) {
          const draftWinner = Number(home.score) > Number(away.score) ? home : away
          draftWinners.push(draftWinner)
        }
      }
    })
    return draftWinners
  }

  useEffect(() => {
    const fetchScoreboard = async () => {
      const response = await fetch(SCOREBOARD_API);
      const data = await response.json();
      const week = data.week.number;
      const events = data.events;
      const winners = getWinners(events);
      const losers = getLosers(events);
      const draftWinners = getDraftWinners(events);
      setWinners(winners);
      setLosers(losers);
      setEvents(events);
      setWeek(week);
      setDrafWinners(draftWinners)
    };
    fetchScoreboard();
  }, []);

  useEffect(() => {
    console.log({ playersRawData });
    const players = playersRawData
      ?.map((player) => {
        const { nombre, timestamp, ...predictions } = player;
        console.log({ nombre, timestamp, predictions });
        const teams = Object.values(predictions);
        return {
          name: nombre,
          teams: teams?.map((team) => ({
            shortDisplayName: team,
            logo: getLogo(team),
            isLoser: isLoser(team),
          })),
          wins: teams?.filter((team) => isWinner(team))?.length,
          draftWinners: teams?.filter((team) => isDraftWinner(team))?.length
        };
      })
      .sort((player1, player2) => (player2.wins + player2.draftWinners) - (player1.wins + player1.draftWinners));
    setPlayersData(players);
  }, [isLoser, isWinner, losers, winners]);

  useEffect(() => {
    const allStatus = events?.map((event) => event?.competitions[0]?.status?.type?.name);
    const hasEnded = (status) => status === "STATUS_FINAL";
    if (allStatus.length > 0 && allStatus?.every(hasEnded)) {
      fireworks();
    };
  }, [events])

  return (
    <ContainerStyled maxWidth="lg">
      <Typography variant="h5" textAlign="center">
        Quiniela NFL
      </Typography>
      {IS_PLAYOFFS ? <Typography variant="h6" textAlign="center">
        Wild Card Round
      </Typography> :
        <Typography variant="h6" textAlign="center">
          Semana {week}
        </Typography>}

      {!playersData.length || daysToNotShowPositions.includes(new Date().getDay()) ? (
        <Paper elevation={3} sx={{ padding: "1rem" }}>
          <Typography variant="h6" gutterBottom>
            Posiciones
          </Typography>
          <Table>
            <TableRow>
              <TableCell>Sin datos</TableCell>
            </TableRow>
          </Table>
        </Paper>
      ) : (
        IS_PLAYOFFS ?
          <PlayoffsRanking events={events} /> :
          <RankedList playersData={playersData} losers={losers} />
      )}

      <Typography variant="h5" textAlign="center" mt={10}>
        Resultados
      </Typography>

      <Grid2 container alignContent="center">
        {events
          ?.sort?.((a, b) => new Date(a?.date) - new Date(b?.date))
          ?.map((event, index) => (
            <Grid2 key={`game-${index}`} size={{ xs: 12 }}>
              <Scoreboard key={`event-${index}`} {...event} />
            </Grid2>
          ))}
      </Grid2>
    </ContainerStyled>
  );
}

export default App;
