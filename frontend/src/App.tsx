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
  SkipToContent,
} from '@carbon/react';
import { HeaderContainerRenderProps } from '@carbon/react/lib/components/UIShell/HeaderContainer';
import { 
  Link, 
  Outlet, 
  Route, 
  Routes, 
  useNavigate 
} from 'react-router-dom';
import { Home, RecentlyViewed, Information, Chemistry, PageBreak } from '@carbon/react/icons';
import { HomePage, PlayerPage, GeneratorPage, HistoryPage } from './pages';

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
          <Column lg={{ span: 12, offset: 4 }} md={8} sm={4}>
            <Outlet />
          </Column>
        </Grid>
      </Content>
    </>
  );
}

export const App = () => (
  <Routes>
    <Route element={<HeaderContainer render={renderMainUI} />} >
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<p>About</p>} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/generator" element={<GeneratorPage />} />
    </Route>
    {/* <Route element={<HeaderContainer render={renderPlayerUI} />} > */}
      <Route path="/play" element={<PlayerPage />} />
      <Route path="/play/:board" element={<PlayerPage />} />
      <Route path="/play/difficulty/:level" element={<PlayerPage />} />
    {/* </Route> */}
  </Routes>
)