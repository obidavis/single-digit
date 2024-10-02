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
import { Link, Outlet, Route, Routes } from 'react-router-dom';
import { HeaderContainerRenderProps } from '@carbon/react/lib/components/UIShell/HeaderContainer';

function renderUI({ isSideNavExpanded, onClickSideNavExpand }: HeaderContainerRenderProps) {
  return (
    <>
      <Header aria-label='header'>
        <HeaderMenuButton aria-label='Expand menu' onClick={onClickSideNavExpand} isActive={isSideNavExpanded} aria-expanded={isSideNavExpanded}/>
        <HeaderName prefix='' href='/'>
          SingleDigit
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
    </>
  );
}

export const App = () => (
  <>
    <HeaderContainer render={renderUI} />
    <Routes>
      <Route path="/" element={<SudokuPage />} />
      <Route path="/play" element={<SudokuPlayerPage />} />
      <Route path="/about" element={<p>About</p>} />
      <Route path="/history" element={<SudokuHistoryPage />} />
      <Route path="/library" element={<p>Library</p>} />
      <Route path="/generator" element={<SudokuGeneratorPage />} />
    </Routes>
  </>
)