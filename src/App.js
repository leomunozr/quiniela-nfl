import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import RankedList from "./RankedList";
import Scoreboard from "./Scoreboard";
import { useEffect, useState } from "react";
import { Box, Grid2, List, ListItem } from "@mui/material";

const SCOREBOARD_API =
  "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";
const TEAMS_API =
  "https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams";
const DATA_API =
  "https://script.google.com/macros/s/AKfycbxj-LElv4wuDMgQGEFFN_vMYUAgNxpVDEEgJg98RFJdi88Ec0Lrzlp7Fp9_W2Rp5boywQ/exec";

function App() {
  const [teamsData, setTeamsData] = useState([]);
  const [events, setEvents] = useState([]);
  const [playersData, setPlayersData] = useState([]);
  const [playersRawData, setPlayersRawData] = useState([]);
  const [week, setWeek] = useState("");
  const [winners, setWinners] = useState([]);

  const getLogo = (shortDisplayName) => {
    const found = teamsData?.filter(
      (item) => item?.team?.shortDisplayName === shortDisplayName
    );
    return found?.[0]?.team?.logos?.[0]?.href;
  };

  const isWinner = (shortDisplayName) => {
    const winner = winners?.find(
      (winner) => winner?.team?.shortDisplayName === shortDisplayName
    );
    return winner?.team?.shortDisplayName === shortDisplayName;
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
      setWinners(winners);
      setEvents(events);
      setWeek(week);
    };
    fetchScoreboard();
  }, []);

  useEffect(() => {
    const getPlayersData = async () => {
      const response = await fetch(DATA_API);
      const data = await response.json();
      setPlayersRawData(data);
    };
    getPlayersData();
  }, []);

  useEffect(() => {
    const getTeamsData = async () => {
      const response = await fetch(TEAMS_API);
      const data = await response.json();
      const teams = data.sports[0].leagues[0].teams;
      setTeamsData(teams);
    };
    getTeamsData();
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
          isWinner: isWinner(team),
        })),
        wins: teams?.filter((team) => isWinner(team))?.length,
      };
    });
    setPlayersData(players);
  }, [teamsData, playersRawData]);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" color="initial">
        Quiniela NFL
      </Typography>
      <Typography variant="h5" color="initial">
        Semana {week}
      </Typography>

      <RankedList playersData={playersData} winners={winners} />

      <Typography variant="h5" textAlign="center" mt={10}>
        Resultados
      </Typography>

      <Grid2 container alignContent="center">
        {events?.map((event, index) => (
          <Grid2 size={{xs: 12}}>
            <Scoreboard key={`event-${index}`} {...event} />
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
}

export default App;
