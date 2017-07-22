import React from "react";
import Input from "material-ui/Input";
import InputLabel from "material-ui/Input/InputLabel";
import Button from "material-ui/Button";
import FormControl from "material-ui/Form/FormControl";
import TextField from "material-ui/TextField";

import PropTypes from "prop-types";
import { withStyles, createStyleSheet } from "material-ui/styles";

import steem from "steem";

const styleSheet = createStyleSheet("TextFields", theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  button: {},
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
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
      })
      if (el.children > 0) {
        getData(el, items);
      } else {
        // leaf
      }
    });
  });
}

// return root {author, permLink}
function getRoot(steemUrl){
  const tokens = steemUrl.split('/')
  const permLink = tokens.pop()      // last piece
  const user = tokens.pop().slice(1) // remove @
  return {
    author: user,
    permlink: permLink
  }
}

export default class SelectUrlStep extends React.Component {
  state = {
    steemitUrl:
      "https://steemit.com/italiano/@luigi-tecnologo/byteball-la-criptovaluta-veloce-e-con-smart-contract-facili",
    totalComments: null,
    shuffledUsers: [],
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange() {
    console.log("a ", this);
  }

  handleClick(ev) {
    const { steemitUrl } = this.state;
    console.log("ev ", steemitUrl);
    const comments = []
    getData(getRoot(steemitUrl), comments)
    setTimeout(() => {

      const totalComments = comments.length

      // unique distinct users, TODO: filter liked
      const users = new Map()
      comments.forEach(el => users.set(el.author))
      const uniqUsers = Array.from(users.keys())
      console.log('U ', uniqUsers)

      // shuffle
      const shuffledUsers = uniqUsers.sort(() => Math.random() - 0.5);

      // console.log('COMM1 ', JSON.stringify(comments))
      console.log('C ', shuffledUsers)

      this.setState({
        totalComments: totalComments,
        shuffledUsers: shuffledUsers
      })

    }, 5000) // timeout
  }

  render() {
    const classes = styleSheet;
    const { totalComments, shuffledUsers, steemitUrl } = this.state;
    return (
      <div className={classes.container}>
        <TextField
          id="steemitUrl"
          label="Steemit Post URL"
          className={classes.textField}
          value={steemitUrl}
          onChange={event => this.setState({ steemitUrl: event.target.value })}
          margin="normal"
        />
        <Button
          raised
          color="primary"
          className={classes.button}
          onClick={event => this.handleClick(event)}
        >
          Get Winner!
        </Button>
        <p>
          {totalComments}
          {shuffledUsers.map( user => (
            <p>
              {user}
            </p>
          ))}
        </p>
      </div>
    );
  }
}
