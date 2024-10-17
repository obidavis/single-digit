import "../styles/History.scss";
import { useSavedPuzzlesStore } from '../hooks/useSavedPuzzles';
import { Button, Column, Content, ContentSwitcher, DataTable, FlexGrid, Grid, IconSwitch, Layer, ProgressBar, Row, Stack, Switch, Table, TableBatchAction, TableBatchActions, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TableSelectAll, TableSelectRow, TableToolbar, TableToolbarAction, TableToolbarContent, TableToolbarMenu, TableToolbarSearch, Toggle } from '@carbon/react';
import { SudokuCard, SudokuCardList } from '../components/GameCard';
import { Collaborate, Download, Grid as GridIcon, Icon, List, Play, TrashCan } from '@carbon/react/icons';
import { useState } from 'react';
import { SudokuGameState } from "../models/Sudoku";
import { Link, useNavigate } from "react-router-dom";


interface TableViewProps {
  recentGames: SudokuGameState[];
}
const CardView = ({ recentGames }: TableViewProps) => {
  return (
    <FlexGrid>
      <Row>
        {recentGames.map((game) => (
          <Column sm={2} md={2} lg={4} key={game.puzzle.clues}>
            <SudokuCard puzzle={game.puzzle} cells={game.cells} resume />
          </Column>
        ))}
      </Row>
    </FlexGrid>
  )
};

const TableView = ({ recentGames }: TableViewProps) => {
  const { removePuzzle } = useSavedPuzzlesStore();
  const navigate = useNavigate();
  const headers = [
    {
      key: 'difficulty',
      header: 'Difficulty',
    },
    {
      key: 'lastPlayed',
      header: 'Last Played',
    },
    {
      key: 'progress',
      header: 'Progress',
    },
    {
      key: 'resume',
      header: 'Resume',
    }
  ];

  const rows = recentGames.map((game) => {
    const calculateProgress = (game: SudokuGameState) => {
      const nonClues = game.cells.filter(cell => !cell.isClue);
      const numNonClues = nonClues.length;
      const filled = nonClues.filter(cell => cell.value !== 0).length;
      return Math.floor(filled / numNonClues * 100);
    }
    return {
      id: game.puzzle.clues,
      difficulty: game.puzzle.difficulty,
      lastPlayed: new Date(game.lastPlayed).toLocaleString(),
      progress: <ProgressBar 
        label="progress" 
        hideLabel 
        value={calculateProgress(game)} 
        helperText={`${calculateProgress(game)}%`}
        status={game.solved ? "finished" : "active"}
        />,
      resume: <Button 
        renderIcon={Play} 
        hasIconOnly 
        kind="primary" 
        iconDescription="Resume" 
        as={Link} 
        to={`/play/${game.puzzle.clues}`}
        state={{ resume: true }} 
        />
    }
  });

  const handleDelete = (rows: any[]) => {
    rows.forEach(row => {
      removePuzzle(row.id);
    });
  };

    return <DataTable rows={rows} headers={headers} >
      {({
      rows,
      headers,
      getHeaderProps,
      getRowProps,
      getSelectionProps,
      getToolbarProps,
      getBatchActionProps,
      onInputChange,
      selectedRows,
      getTableProps,
      getTableContainerProps,
      selectRow,
    }) => {
      const batchActionProps = {
        ...getBatchActionProps({
          onSelectAll: () => {
            rows.map(row => {
              if (!row.isSelected) {
                selectRow(row.id);
              }
            });
          }
        })
      };

      return (<TableContainer {...getTableContainerProps()}>
            <TableToolbar {...getToolbarProps()}>
              <TableBatchActions {...batchActionProps}>
                <TableBatchAction tabIndex={batchActionProps.shouldShowBatchActions ? 0 : -1} renderIcon={TrashCan} onClick={() => handleDelete(selectedRows)}>
                  Delete
                </TableBatchAction>
              </TableBatchActions>
            </TableToolbar>
            <Table {...getTableProps()} aria-label="sample table">
              <TableHead>
                <TableRow>
                  <TableSelectAll {...getSelectionProps()} />
                  {headers.map((header, i) => <TableHeader {...getHeaderProps({ header })} key={i}>
                      {header.header}
                    </TableHeader>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, i) => <TableRow  {...getRowProps({ row })} key={i}>
                    <TableSelectRow {...getSelectionProps({ row })} />
                    {row.cells.map(cell => <TableCell key={cell.id}>{cell.value}</TableCell>)}
                  </TableRow>)}
              </TableBody>
            </Table>
          </TableContainer>
      );
    }}
    </DataTable>
}

enum View {
  Card = 0,
  List = 1
};

export const HistoryPage = () => {
  const { savedGames, removePuzzle } = useSavedPuzzlesStore();
  const savedPuzzles = Object.entries(savedGames)
    .sort((a, b) => b[1].lastPlayed - a[1].lastPlayed)
    .map(([_, puzzle]) => puzzle);

  const [view, setView] = useState(View.Card);

  return (
    <Stack gap={4}>
      <h3>History</h3>
      <div className="history-controls">
        <ContentSwitcher className="center" size='md' selectedIndex={view} onChange={({ index }) => setView(index!)} style={{ width: "fit-content" }}>
          <IconSwitch name="card-view" index={View.Card} label="Card View" align="bottom-left">
            <GridIcon />
          </IconSwitch>
          <IconSwitch name="list-view" index={View.List} label="List View" align="bottom-right">
            <List />
          </IconSwitch>
        </ContentSwitcher>
        <Toggle id="showCompleted" size='md' labelText='Show Completed' hideLabel className="left"/>
      </div>
      <Layer>
        {view === View.Card ? (
          <CardView recentGames={savedPuzzles} />
        ) : (
          <TableView recentGames={savedPuzzles} />
        )}
      </Layer>
    </Stack>
  );
}
