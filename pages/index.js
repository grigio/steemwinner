import Head from 'next/head';
import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider } from 'material-ui/styles';
import Root from '../components/App';

export default function App() {
  return (
    <MuiThemeProvider>
      <Root />
    </MuiThemeProvider>
  );
}
