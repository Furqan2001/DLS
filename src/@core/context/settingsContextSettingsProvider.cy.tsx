import React from "react";
import { SettingsProvider } from "./settingsContext";

describe("<SettingsProvider />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <SettingsProvider>
        <div></div>
      </SettingsProvider>
    );
  });
});
