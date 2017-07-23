import React from "react";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import { withStyles, createStyleSheet } from "material-ui/styles";
import Typography from "material-ui/Typography";

import SelectUrlStep from "./select-url-step";

const styleSheet = createStyleSheet("GuttersGrid", theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#1a5099",
    minHeight: "600px"
  },
  steemBox: {
    minHeight: "500px"
  },
  footer:{
    backgroundColor: '#eff1ef'
  },
  paper: {
    padding: "1em"
  }
}));

class App extends React.Component {
  render() {
    const classes = this.props.classes;
    return (
      <Grid container className={classes.root} justify="center">
        <Paper className={classes.paper}>
          <Grid item xs={12} sm={10}>
            <Grid container justify="center" align="center" direction="column">
              <Typography type="display2" gutterBottom>
                SteemWinner
              </Typography>
              <img src="/static/steemwinner.svg" alt="SteemWinner" />              
            </Grid>
            <Typography type="headline" gutterBottom>
              Pick randomly one or more winners from the people who commented on
              your Steem post.
            </Typography>
          </Grid>
          <Grid container className={classes.steemBox}>
            <Grid item xs={12} sm={10}>
              <SelectUrlStep />
            </Grid>
          </Grid>

          <Grid container gutter={24} justify="center" className={classes.footer}>
            <Grid item xs={3}>
              <a href="https://github.com/grigio/steemwinner">Source Code</a> on Github
            </Grid>
            <Grid item xs={3}>
              Donate Steem to <a href="https://steemit.com/@luigi-tecnologo">@luigi-tecnologo</a>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  }
}

export default withStyles(styleSheet)(App);
