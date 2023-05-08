import React from 'react'
import VerticalNavItems from './VerticalNavItems'

describe('<VerticalNavItems />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<VerticalNavItems />)
  })
})