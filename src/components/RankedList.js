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

const RankedList = ({ playersData }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const maxWins = Math.max(...playersData?.map((player) => player.wins));

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
              const { name, teams, wins } = player;
              return (
                <HighlightedRow
                  key={`row-${index}`}
                  onClick={() => handleItemClick(name)}
                  isSelected={selectedItem === name}
                >
                  <NameColumn>
                    <Typography variant="caption">{name}</Typography>
                  </NameColumn>
                  <TableCell>
                    <PlayerScore
                      name={name}
                      teams={teams}
                      wins={wins}
                      hasMostWins={wins === maxWins}
                    />
                  </TableCell>
                  <ResultColumn>
                    <MatchCount hasMostWins={wins === maxWins}>
                      {wins || "-"}
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
