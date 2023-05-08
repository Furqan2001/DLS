import React from 'react'
import UserInfoContextProvider from './UserInfoContext'

describe('<UserInfoContextProvider />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<UserInfoContextProvider />)
  })
})