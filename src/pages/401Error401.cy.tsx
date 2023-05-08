import React from 'react'
import Error401 from './401'

describe('<Error401 />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Error401 />)
  })
})