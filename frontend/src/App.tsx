import './styles/App.scss';
import {
  ClassPrefix,
  Column,
  Content,
  Grid,
  Header,
  HeaderContainer,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderName,
  HeaderNavigation,
  HeaderSideNavItems,
  IconButton,
  Row,
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavLinkText,
  SideNavMenuItem,
} from '@carbon/react';


import { SudokuPage } from './pages/SudokuPage';
import { renderPlayerUI, SudokuPlayerPage } from './pages/SudokuPlayer';
import { SudokuHistoryPage } from './pages/SudokuHistory';
import { SudokuGeneratorPage } from './pages/SudokuGenerator';
import { Library } from './pages/Library';
import { Link, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { HeaderContainerRenderProps } from '@carbon/react/lib/components/UIShell/HeaderContainer';
import { Home, Query, RecentlyViewed, ToolKit, Information, Chemistry } from '@carbon/react/icons';

function renderMainUI({ isSideNavExpanded, onClickSideNavExpand }: HeaderContainerRenderProps) {
  return (
    <>
      <Header aria-label='header'>
        <HeaderMenuButton aria-label='Expand menu' onClick={onClickSideNavExpand} isActive={isSideNavExpanded} aria-expanded={isSideNavExpanded}/>
        <HeaderName prefix='SingleDigit' href='/'>
        </HeaderName>
      <SideNav 
        aria-label='Side navigation'
        expanded={isSideNavExpanded} 
        onOverlayClick={onClickSideNavExpand} 
        onSideNavBlur={onClickSideNavExpand}
        >
        <SideNavItems>
          <SideNavItems>
            <SideNavLink as={Link} to={"/"} onClick={onClickSideNavExpand} renderIcon={Home}>
              <SideNavLinkText>Home</SideNavLinkText>
            </SideNavLink>
            <SideNavLink as={Link} to={"/about"} onClick={onClickSideNavExpand} renderIcon={Information}>
              About
            </SideNavLink>
            <SideNavLink as={Link} to={"/history"} onClick={onClickSideNavExpand} renderIcon={RecentlyViewed}>
              History
            </SideNavLink>
            <SideNavLink as={Link} to={"/generator"} onClick={onClickSideNavExpand} renderIcon={Chemistry}>
              Generator
            </SideNavLink>
          </SideNavItems>
        </SideNavItems>
      </SideNav>
      </Header>
      <Content>
        <Grid>
          {/* <Row> */}
            <Column lg={{ span: 12, offset: 4 }} md={8} sm={4}>
              <Outlet />
            </Column>
          {/* </Row> */}
        </Grid>
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
      <Route path="/generator" element={<SudokuGeneratorPage />} />
    </Route>
    {/* <Route element={<HeaderContainer render={renderPlayerUI} />} > */}
      <Route path="/play" element={<SudokuPlayerPage />} />
      <Route path="/play/:board" element={<SudokuPlayerPage />} />
      <Route path="/play/difficulty/:level" element={<SudokuPlayerPage />} />
    {/* </Route> */}
  </Routes>
)