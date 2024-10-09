import './styles/App.scss';
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
  IconButton,
  SideNav,
  SideNavItems,
} from '@carbon/react';

import {
  ArrowLeft,
  ChevronLeft
} from '@carbon/icons-react';


import { SudokuPage } from './pages/SudokuPage';
import { renderPlayerUI, SudokuPlayerPage } from './pages/SudokuPlayer';
import { SudokuHistoryPage } from './pages/SudokuHistory';
import { SudokuGeneratorPage } from './pages/SudokuGenerator';
import { Library } from './pages/Library';
import { Link, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { HeaderContainerRenderProps } from '@carbon/react/lib/components/UIShell/HeaderContainer';

function renderMainUI({ isSideNavExpanded, onClickSideNavExpand }: HeaderContainerRenderProps) {
  return (
    <>
      <Header aria-label='header'>
        <HeaderMenuButton aria-label='Expand menu' onClick={onClickSideNavExpand} isActive={isSideNavExpanded} aria-expanded={isSideNavExpanded}/>
        <HeaderName prefix='SingleDigit' href='/'>
          Sudoku
        </HeaderName>
        <HeaderNavigation aria-label='menu'>
          <HeaderMenuItem as={Link} to={"/"}>
            Home
          </HeaderMenuItem>
          <HeaderMenuItem as={Link} to={"/about"} >
            About
          </HeaderMenuItem>
          <HeaderMenuItem as={Link} to={"/history"}>
            History
          </HeaderMenuItem>
          <HeaderMenuItem as={Link} to={"/library"}>
            Library
          </HeaderMenuItem>
          <HeaderMenuItem as={Link} to={"/generator"}>
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
            <HeaderMenuItem as={Link} to={"/about"} onClick={onClickSideNavExpand}>
              About
            </HeaderMenuItem>
            <HeaderMenuItem as={Link} to={"/history"} onClick={onClickSideNavExpand}>
              History
            </HeaderMenuItem>
            <HeaderMenuItem as={Link} to={"/library"} onClick={onClickSideNavExpand}>
              Library
            </HeaderMenuItem>
            <HeaderMenuItem as={Link} to={"/generator"} onClick={onClickSideNavExpand}>
              Generator
            </HeaderMenuItem>
          </HeaderSideNavItems>
        </SideNavItems>}
      </SideNav>
      </Header>
      <Content>
        <Outlet />
      </Content>
    </>
  );
}

export const App = () => (
  <Routes>
    <Route element={<HeaderContainer render={renderMainUI} />} >
      <Route path="/" element={<SudokuPage />} />
      <Route path="/about" element={<p>About</p>} />
      <Route path="/history" element={<SudokuHistoryPage />} />
      <Route path="/library" element={<Library />} />
      <Route path="/generator" element={<SudokuGeneratorPage />} />
    </Route>
    {/* <Route element={<HeaderContainer render={renderPlayerUI} />} > */}
      <Route path="/play" element={<SudokuPlayerPage />} />
      <Route path="/play/:board" element={<SudokuPlayerPage />} />
      <Route path="/play/difficulty/:level" element={<SudokuPlayerPage />} />
    {/* </Route> */}
  </Routes>
)