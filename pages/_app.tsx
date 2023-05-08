import type { AppProps } from "next/app";
import { Container, Header, Segment, Grid } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";
import "./index.css"; // Import the custom CSS file

const Layout: React.FC = ({ children }) => {
  return (
    <div
      style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}
    >
      <Segment inverted vertical textAlign="center" padded color="blue">
        <Header as="h1" inverted>
          Polkadot Validator Dashboard
        </Header>
      </Segment>
      <Container style={{ flex: 1, paddingTop: "2em", paddingBottom: "2em" }}>
        {children}
      </Container>
      <Segment vertical style={{ padding: "2em 0em" }}>
        <Container textAlign="center">
          <Grid divided inverted stackable>
            <Grid.Row>
              <Grid.Column>
                <Header as="h4" content="Polkadot Validator Dashboard" />
                <p>
                  © {new Date().getFullYear()} All rights reserved. Polkadot
                  Validator Dashboard is not affiliated with or endorsed by
                  Polkadot.
                </p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Segment>
    </div>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
