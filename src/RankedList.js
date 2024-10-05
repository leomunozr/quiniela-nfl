import { useState } from "react";
import styled from "styled-components";
import { List, ListItem, Typography, Paper } from "@mui/material";
import PlayerScore from "./PlayerScore";

// Styled component for the Paper container
const StyledPaper = styled(Paper)`
  padding: 20px;
  margin: 20px;
  background-color: #f5f5f5;
`;

// Styled component for highlighting selected item
const HighlightedItem = styled(ListItem)`
  background-color: ${(props) =>
    props.isSelected ? "#e3f2fd" : "transparent"};
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #e0e0e0;
  }
`;

const RankedList = ({ playersData }) => {
  console.log({ playersData });
  const [selectedItem, setSelectedItem] = useState(null);
  const maxWins = Math.max(...playersData?.map((player) => player.wins));

  const handleItemClick = (name) => {
    setSelectedItem(name);
  };

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h6" gutterBottom>
        Posiciones
      </Typography>
      <List>
        {playersData?.map((player, index) => {
          const { name, teams, wins } = player;
          return (
            <HighlightedItem
              button
              key={`player-${index}`}
              isSelected={selectedItem === name}
              onClick={() => handleItemClick(name)}
            >
              <ListItem>
                <PlayerScore
                  name={name}
                  teams={teams}
                  wins={wins}
                  hasMostWins={wins === maxWins}
                />
              </ListItem>
            </HighlightedItem>
          );
        })}
      </List>
    </StyledPaper>
  );
};

export default RankedList;
