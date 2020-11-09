import React from 'react'
import { Fragment } from 'react'
import './overlay.css'

export default function Overlay(props) {
   const Component = props.component
   const Overlay = () => props.overlay || (
      <div id="overlay" style={{display: props.fetching ? 'block' : 'none'}}>
         <p>Loading ...</p>
      </div>
   )
   return (
      <Fragment>
         <Overlay></Overlay>
         <Component></Component>
      </Fragment>
   )
}