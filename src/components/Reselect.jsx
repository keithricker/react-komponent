import React from 'react'
import { createSelector } from 'reselect'
import { connect } from 'react-redux'

// Note: selectors are usually created in a relevant reducer file or a separate selectors file
const getPosts = (state,prps) => {
   const gettem = (state) => state.posts
   return createSelector(
      gettem,
      posts => posts.posts
   )(state)
}

// in DisplayBelts.js
export default class Reselect extends React.Component {
  render() {
    console.log('posts',this.props)
    return <div></div>
    // return posts.map(post => <h2>{post.title}</h2>);
  }
}
