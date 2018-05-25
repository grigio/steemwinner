import React from "react";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Autorenew from "@material-ui/icons/Autorenew";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MailIcon from '@material-ui/icons/Mail';

import PropTypes from "prop-types";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";

import steem from "steem";

const styleSheet = createMuiTheme("TextFields", theme => ({
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
  tag: {
    margin: '1px',
    fontWeight: 500
  },
  textField: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    // width: 200
  }
}));


// const theme = createMuiTheme({
//   props: {
//     // Name of the component ⚛️
//     MuiButtonBase: {
//       // The properties to apply
//       disableRipple: true, // No more ripple, on the whole application 💣!
//     },
//   },
// });

// recursive return all the comments
function getData(root, items) {
  steem.api.getContentReplies(root.author, root.permlink, (err, results) => {
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
  })
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
    // steemitUrl:
    //   'https://steemit.com/stats/@slorunner/global-stats-7-8-aug-global-hashtag-comment-and-post-rankings',
    steemitUrl:
      "https://steemit.com/italiano/@luigi-tecnologo/announcement-steemwinner-the-easiest-way-to-pick-up-your-contest-or-giveaway-winners",
    loading: false,
    totalComments: null,
    shuffledUsers: []
  };

  constructor(props) {
    super(props);
    steem.api.setOptions({ url: 'https://api.steemit.com' });
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(ev) {
    const { steemitUrl, loading } = this.state;
    this.setState({ loading: true });
    console.log("ev ", steemitUrl);

    const rootPost = getRoot(steemitUrl);

    steem.api.getContent(rootPost.author, rootPost.permlink, (err, post) => {
      const voters = post.active_votes.map(item => item.voter);

      const comments = [];
      getData(rootPost, comments);
      setTimeout(() => {
        const totalComments = comments.length;

        // TODO: filter liked option
        const users = new Map();
        comments.forEach(el => {
          // hashtag with accent letters regex
          const userTags = new Set(el.body.match(/\B#\w*[a-zA-Z\u00C0-\u00FF]+\w*/gi));
          users.set(el.author, {
            voter: voters.includes(el.author),
            tags: userTags
          });
        });
        const uniqUsers = [];
        const globalTags = {} // key num

        users.forEach((v, k) => {
          const tagsArray = Array.from(v.tags).sort((a, b) => a > b);
          uniqUsers.push({
            name: k,
            voter: v.voter,
            tags: tagsArray
          });
          tagsArray.forEach(tag => {
            tag = tag.toLowerCase()
            // pushOrInsertTag
            globalTags[tag] ? globalTags[tag] += 1 : globalTags[tag] = 1
          });
        });


        // shuffle
        const shuffledUsers = uniqUsers.sort(() => Math.random() - 0.5);

        // console.log("C ", shuffledUsers, users);

        this.setState({
          globalTags: globalTags,
          totalComments: totalComments,
          shuffledUsers: shuffledUsers,
          loading: false
        });
      }, 5000); // timeout
    })
  }

  render() {
    const { classes } = this.props;
    const { globalTags, totalComments, shuffledUsers, steemitUrl, loading } = this.state;
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
              onKeyPress={(ev) => ev.key === 'Enter' ? this.handleClick(ev) : null}
              margin="normal"
            />
          </Grid>
          <Grid item sm={3}>
            <Button
              raised="true"
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
        <p>
            {globalTags && Object.keys(globalTags)
              .sort((a, b) => globalTags[b] - globalTags[a])
              .map(el => (
                <span className={classes.tag}>{el + '(' + globalTags[el] + ')'} </span>
              ))}
          </p>
          <List>

            {shuffledUsers.map((user, index) =>
              <ListItem key={index} button>
                {index + 1 + ' '}
                {user.voter ? <MailIcon /> : <MailIcon style={{ color: 'rgb(210,210,210)' }} />}

                {user.name}

                {user.tags.map(tag => (
                  <span className={classes.tag} key={tag}>{tag}</span>
                ))}
              </ListItem>
            )}

          </List>
        </div>
      </div>
    );
  }
}

export default withStyles(styleSheet)(SelectUrlStep);
