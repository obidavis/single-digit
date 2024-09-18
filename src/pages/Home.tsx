import { Tile, FlexGrid as Grid, Row, Column } from "@carbon/react"

const DemoContent = ({ children }: any) => (
  <Tile>
    {children}
  </Tile>
)

export const Home = () => {
  return (
    <Grid>
      <Row>
        <Column>
          <DemoContent>Span 25%</DemoContent>
        </Column>
        <Column>
          <DemoContent>Span 25%</DemoContent>
        </Column>
        <Column>
          <DemoContent>Span 25%</DemoContent>
        </Column>
        <Column>
          <DemoContent>Span 25%</DemoContent>
        </Column>
      </Row>
  </Grid>
  )
}