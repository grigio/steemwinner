import Head from "next/head";
import React from "react";
import ReactDOM from "react-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Root from "../components/App";
// import Head from "next/head";
// import 'typeface-roboto'

const theme = createMuiTheme({
})

export default function App() {
  return (
    <div>
      <Head>
        <title>SteemWinner</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <MuiThemeProvider theme={theme}>
        <Root />
      </MuiThemeProvider>
    </div>
  );
}
