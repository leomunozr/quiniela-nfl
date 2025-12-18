import { useState } from "react";
import styled from "styled-components";
import styledMui from "@mui/material/styles/styled";
import {
  Typography,
  Paper,
  TableContainer,
  TableRow,
  Table,
  TableBody,
  TableCell,
  Tooltip,
} from "@mui/material";
import PlayerScore from "./PlayerScore";

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

const MAX_NAME_LENGTH = 54;

const truncateName = (name) => {
  if (name.length <= MAX_NAME_LENGTH) return name;
  const words = name.split(" ");
  let truncated = "";

  for (let word of words) {
    const nextLength =
      truncated.length + (truncated.length > 0 ? 1 : 0) + word.length;
    if (nextLength <= MAX_NAME_LENGTH) {
      truncated += (truncated.length > 0 ? " " : "") + word;
    } else {
      break;
    }
  }

  if (truncated.length === 0) {
    return name.substring(0, MAX_NAME_LENGTH) + "...";
  }

  return truncated + "...";
};

const RankedList = ({ playersData }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const maxWins = Math.max(...playersData?.map((player) => player.wins + player.draftWinners));
  const handleItemClick = (name) => {
    selectedItem === name ? setSelectedItem("") : setSelectedItem(name);
  };

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h6" gutterBottom>
        Posiciones
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableBody>
            {playersData?.map((player, index) => {
              const { name, teams, wins, draftWinners } = player;
              const displayName = truncateName(name);
              return (
                <HighlightedRow
                  key={`row-${index}`}
                  onClick={() => handleItemClick(name)}
                  isSelected={selectedItem === name}
                >
                  <NameColumn>
                    <Tooltip title={name} placement="top" enterTouchDelay={0}>
                      <Typography variant="caption">{displayName}</Typography>
                    </Tooltip>
                  </NameColumn>
                  <TableCell>
                    <PlayerScore
                      name={name}
                      teams={teams}
                      wins={wins + draftWinners}
                      hasMostWins={(wins + draftWinners) === maxWins}
                    />
                  </TableCell>
                  <ResultColumn>
                    <MatchCount hasMostWins={(wins + draftWinners) === maxWins}>
                      {(wins + draftWinners) || "-"}
                    </MatchCount>
                  </ResultColumn>
                </HighlightedRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledPaper>
  );
};

export default RankedList;
