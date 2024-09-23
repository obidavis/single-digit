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
import { Home } from './pages';
import { Link, Route, Routes } from 'react-router-dom';
import { HeaderContainerRenderProps } from '@carbon/react/lib/components/UIShell/HeaderContainer';
// import { Sudoku } from './Game/Sudoku';

function renderUI({ isSideNavExpanded, onClickSideNavExpand }: HeaderContainerRenderProps) {
  console.log('renderUI', isSideNavExpanded, onClickSideNavExpand);
  return (
    <>
      <Header>
        {/* <SkipToContent/> */}
        <HeaderMenuButton onClick={onClickSideNavExpand} isActive={isSideNavExpanded} aria-expanded={isSideNavExpanded}/>
        <HeaderName prefix='' href='/'>
          SingleDigit
        </HeaderName>
        <HeaderNavigation>
          <HeaderMenuItem as={Link} to={"/"}>
            Home
          </HeaderMenuItem>
          <HeaderMenuItem as={Link} to={"/sudoku"}>
            Sudoku
          </HeaderMenuItem>
        </HeaderNavigation>
      <SideNav 
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
          </HeaderSideNavItems>
        </SideNavItems>}
      </SideNav>
      </Header>
      <Content>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sudoku" element={<SudokuPage />} />
          <Route path="/sudoku/play" element={<SudokuPlayerPage />} />
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