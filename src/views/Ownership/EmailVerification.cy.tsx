import React from 'react'
import EmailVerification from './EmailVerification'

describe('<EmailVerification />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<EmailVerification />)
  })
})