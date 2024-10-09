import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Grid2, styled } from "@mui/material";

import RankedList from "./components/RankedList";
import Scoreboard from "./components/Scoreboard";
import playersRawData from "./data/playersData";
import teamsData from "./data/teams";
import { SCOREBOARD_API } from "./constants";

const ContainerStyled = styled(Container)`
  padding-left: 0;
  padding-right: 0;
`;

function App() {
  const [events, setEvents] = useState([]);
  const [playersData, setPlayersData] = useState([]);
  const [week, setWeek] = useState("");
  const [winners, setWinners] = useState([]);
  const [losers, setLosers] = useState([]);

  const getLogo = (shortDisplayName) => {
    const found = teamsData?.filter(
      (item) => item?.team?.shortDisplayName === shortDisplayName
    );
    return found?.[0]?.team?.logos?.[0]?.href;
  };

  const isLoser = (shortDisplayName) => {
    const loser = losers?.find(
      (loser) => loser?.team?.shortDisplayName === shortDisplayName
    );
    return loser?.team?.shortDisplayName === shortDisplayName;
  };

  const isWinner = (shortDisplayName) => {
    const winner = winners?.find(
      (winner) => winner?.team?.shortDisplayName === shortDisplayName
    );
    return winner?.team?.shortDisplayName === shortDisplayName;
  };

  const getLosers = (events) => {
    return events?.map((event) => {
      const game = event.competitions[0];
      if (game.status.type.name === "STATUS_FINAL") {
        return game.competitors?.filter(
          (competitor) => !competitor?.winner
        )?.[0];
      }
    });
  };

  const getWinners = (events) => {
    return events?.map(
      (event) =>
        event?.competitions?.[0]?.competitors?.filter(
          (competitor) => competitor?.winner
        )?.[0]
    );
  };

  useEffect(() => {
    const fetchScoreboard = async () => {
      const response = await fetch(SCOREBOARD_API);
      const data = await response.json();
      const week = data.week.number;
      const events = data.events;
      const winners = getWinners(events);
      const losers = getLosers(events);
      setWinners(winners);
      setLosers(losers);
      setEvents(events);
      setWeek(week);
    };
    fetchScoreboard();
  }, []);

  useEffect(() => {
    const players = playersRawData?.map((player) => {
      const { nombre, timestamp, ...predictions } = player;
      const teams = Object.values(predictions);
      return {
        name: nombre,
        teams: teams?.map((team) => ({
          shortDisplayName: team,
          logo: getLogo(team),
          isLoser: isLoser(team),
        })),
        wins: teams?.filter((team) => isWinner(team))?.length,
      };
    }).sort((player1, player2) => player2.wins - player1.wins);
    setPlayersData(players);
  }, [teamsData, playersRawData, losers]);

  return (
    <ContainerStyled maxWidth="lg">
      <Typography variant="h5" textAlign="center">
        Quiniela NFL
      </Typography>
      <Typography variant="h6" textAlign="center">
        Semana {week}
      </Typography>

      <RankedList playersData={playersData} losers={losers} />

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
