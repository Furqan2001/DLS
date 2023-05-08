import React from 'react'
import Error500 from './500'

describe('<Error500 />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Error500 />)
  })
})