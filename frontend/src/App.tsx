import './App.scss';
import {
  ClassPrefix,
  Content,
  Header,
  HeaderContainer,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderName,
  HeaderNavigation,
  HeaderSideNavItems,
  SideNav,
  SideNavItems,
} from '@carbon/react';


import { SudokuPage } from './pages/SudokuPage';
import { SudokuPlayerPage } from './pages/SudokuPlayer';
import { SudokuHistoryPage } from './pages/SudokuHistory';
import { SudokuGeneratorPage } from './pages/SudokuGenerator';
import { Home } from './pages';
import { Link, Route, Routes } from 'react-router-dom';
import { HeaderContainerRenderProps } from '@carbon/react/lib/components/UIShell/HeaderContainer';
// import { Sudoku } from './Game/Sudoku';

function renderUI({ isSideNavExpanded, onClickSideNavExpand }: HeaderContainerRenderProps) {
  return (
    <>
      <Header aria-label='header'>
        {/* <SkipToContent/> */}
        <HeaderMenuButton aria-label='Expand menu' onClick={onClickSideNavExpand} isActive={isSideNavExpanded} aria-expanded={isSideNavExpanded}/>
        <HeaderName prefix='' href='/'>
          SingleDigit
        </HeaderName>
        <HeaderNavigation aria-label='menu'>
          <HeaderMenuItem as={Link} to={"/"}>
            Home
          </HeaderMenuItem>
          <HeaderMenuItem as={Link} to={"/sudoku"}>
            Sudoku
          </HeaderMenuItem>
          <HeaderMenuItem as={Link} to={"/sudoku/history"}>
            History
          </HeaderMenuItem>
          <HeaderMenuItem as={Link} to={"/sudoku/generator"}>
            Generator
          </HeaderMenuItem>
        </HeaderNavigation>
      <SideNav 
        aria-label='Side navigation'
        expanded={isSideNavExpanded} 
        onOverlayClick={onClickSideNavExpand} 
        onSideNavBlur={onClickSideNavExpand}
        isPersistent={false}
        >
        {isSideNavExpanded && <SideNavItems>
          <HeaderSideNavItems>
            <HeaderMenuItem as={Link} to={"/"} onClick={onClickSideNavExpand}>
              Home
            </HeaderMenuItem>
            <HeaderMenuItem as={Link} to={"/sudoku"} onClick={onClickSideNavExpand}>
              Sudoku
            </HeaderMenuItem>
            <HeaderMenuItem as={Link} to={"/sudoku/history"} onClick={onClickSideNavExpand}>
              History
            </HeaderMenuItem>
            <HeaderMenuItem as={Link} to={"/sudoku/generator"} onClick={onClickSideNavExpand}>
              Generator
            </HeaderMenuItem>
          </HeaderSideNavItems>
        </SideNavItems>}
      </SideNav>
      </Header>
      <Content>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sudoku" element={<SudokuPage />} />
          <Route path="/sudoku/play" element={<SudokuPlayerPage />} />
          <Route path="/sudoku/history" element={<SudokuHistoryPage />} />
          <Route path="/sudoku/generator" element={<SudokuGeneratorPage />} />
        </Routes>
      </Content>
    </>
  );
}

export const App = () => (
  <ClassPrefix prefix="single-digit">
    <HeaderContainer render={renderUI} />
  </ClassPrefix>
)