import { useState } from "react";
import styled from "styled-components";
import styledMui from "@mui/material/styles/styled";
import {
  Typography,
  Paper,
  TableRow,
  Table,
  TableBody,
  TableCell,
  Box,
} from "@mui/material";
import { points } from "../data/acc";

const hoverColor = "#e0e0e0";
const selectedColor = "#e3f2fd";

const StyledPaper = styledMui(Paper)`
  padding: 1rem;
`;

const Centered = styledMui(Box)`
  display: flex;
  justify-content: center;
`;

const TableStyled = styledMui(Table)`
  width: auto;
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

const Accumulated = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const maxWins = Math.max(...Object.values(points));
  const handleItemClick = (name) => {
    selectedItem === name ? setSelectedItem("") : setSelectedItem(name);
  };

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h6" gutterBottom>
        Puntos Acumulados
      </Typography>
      <Centered>
        <TableStyled>
          <TableBody>
            {Object.entries(points)?.map(([name, points]) => {
              return (
                <HighlightedRow
                  key={`row-${name}`}
                  onClick={() => handleItemClick(name)}
                  isSelected={selectedItem === name}
                >
                  <NameColumn>
                    <Typography variant="caption">{name}</Typography>
                  </NameColumn>
                  <ResultColumn>
                    <MatchCount hasMostWins={points === maxWins}>
                      {(points) || "-"}
                    </MatchCount>
                  </ResultColumn>
                </HighlightedRow>
              );
            })}
          </TableBody>
        </TableStyled>
      </Centered>
    </StyledPaper>
  );
};

export default Accumulated;
