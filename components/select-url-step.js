import React from "react";
import Input from "material-ui/Input";
import InputLabel from "material-ui/Input/InputLabel";
import Button from "material-ui/Button";
import FormControl from "material-ui/Form/FormControl";
import TextField from "material-ui/TextField";
import CircularProgress from "material-ui/Progress";
import Autorenew from "material-ui-icons/Autorenew";
import Grid from "material-ui/Grid";
import List, { ListItem, ListItemText } from "material-ui/List";

import PropTypes from "prop-types";
import { withStyles, createStyleSheet } from "material-ui/styles";

import steem from "steem";

const styleSheet = createStyleSheet("TextFields", theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  button: {
    marginTop: "17px"
  },
  progress: {
    // margin: `0 ${theme.spacing.unit * 2}px`,
  },
  grid: {
    direction: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "100px"
  },
  textField: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    // width: 200
  }
}));

// recursive return all the comments
function getData(root, items) {
  steem.api.getContentReplies(root.author, root.permlink).then(results => {
    results.map(el => {
      items.push({
        author: el.author,
        body: el.body,
        created: el.created,
        permlink: el.permlink
      });
      if (el.children > 0) {
        getData(el, items);
      } else {
        // leaf
      }
    });
  });
}

// return root {author, permLink}
function getRoot(steemUrl) {
  const tokens = steemUrl.split("/");
  const permLink = tokens.pop(); // last piece
  const user = tokens.pop().slice(1); // remove @
  return {
    author: user,
    permlink: permLink
  };
}

class SelectUrlStep extends React.Component {
  state = {
    steemitUrl: '',
      // "https://steemit.com/italiano/@luigi-tecnologo/announcement-steemwinner-the-easiest-way-to-pick-up-your-contest-or-giveaway-winners",
    loading: false,
    totalComments: null,
    shuffledUsers: []
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(ev) {
    const { steemitUrl, loading } = this.state;
    this.setState({ loading: true });
    console.log("ev ", steemitUrl);

    const rootPost = getRoot(steemitUrl);

    steem.api.getContent(rootPost.author, rootPost.permlink).then(post => {
      const voters = post.active_votes.map(item => item.voter);
      //console.log(voters)

      const comments = [];
      getData(rootPost, comments);
      setTimeout(() => {
        const totalComments = comments.length;

        // unique distinct users, TODO: filter liked
        const users = new Map();
        comments.forEach(el => users.set(el.author, {voter: voters.includes(el.author) }));
        const uniqUsers = [];
        users.forEach( (v,k) => uniqUsers.push({name:k, voter:v.voter}) )

        // console.log("U ", uniqUsers, totalComments);

        // shuffle
        const shuffledUsers = uniqUsers.sort(() => Math.random() - 0.5);

        // console.log('COMM1 ', JSON.stringify(comments))
        console.log("C ", shuffledUsers, users);

        this.setState({
          totalComments: totalComments,
          shuffledUsers: shuffledUsers,
          loading: false
        });
      }, 5000); // timeout
    });
  }

  render() {
    const { classes } = this.props;
    const { totalComments, shuffledUsers, steemitUrl, loading } = this.state;
    return (
      <div className={classes.container}>
        <Grid container className={classes.grid}>
          <Grid item sm={9}>
            <TextField
              id="steemitUrl"
              label="Steemit Post URL"
              fullWidth={true}
              className={classes.textField}
              value={steemitUrl}
              onChange={event =>
                this.setState({ steemitUrl: event.target.value })}
              margin="normal"
            />
          </Grid>
          <Grid item sm={3}>
            <Button
              raised
              disabled={loading || steemitUrl.length === 0}
              color="primary"
              className={classes.button}
              onClick={event => this.handleClick(event)}
            >
              {!loading
                ? "Get Winner!!"
                : <Autorenew className={classes.progress} />}
            </Button>
          </Grid>
        </Grid>

        <div>
          <List>
            {shuffledUsers.map((user, index) =>
              <ListItem key={index.name} button>
                <ListItemText primary={index + 1 + " - " + user.name } />
                {user.voter ? '(voted)': ''}
              </ListItem>
            )}
          </List>
        </div>
      </div>
    );
  }
}

export default withStyles(styleSheet)(SelectUrlStep);
