import Head from "next/head";
import React from "react";
import ReactDOM from "react-dom";
import { MuiThemeProvider } from "material-ui/styles";
import Root from "../components/App";
// import Head from "next/head";
// import 'typeface-roboto'

export default function App() {
  return (
    <div>
      <Head>
        <title>SteemWinner</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
        />
 <style>{`
      body { 
        font: 13px Roboto, sans-serif;
      }
    `}</style>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <MuiThemeProvider>
        <Root />
      </MuiThemeProvider>
    </div>
  );
}
