import React from 'react'
import SelectUrlStep from './select-url-step'

export default class App extends React.Component {

  state = {
    url: 'nulltest'
  }

  render() {
    const {url} = this.state
    return (
      <div>
        <h2>Steem Winner</h2>
        <h4>Pick a winner from your Steemit posts</h4>
        <SelectUrlStep />
      </div>
    )
  }
}