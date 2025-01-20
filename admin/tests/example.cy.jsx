// <reference types="cypress" />

describe('Config Sync', () => {
  it('Check that admin page renders correctly', () => {
    cy.login();
    cy.navigateToAdminPage();

    cy.contains('Welcome to Boilerplate')
  });
});
