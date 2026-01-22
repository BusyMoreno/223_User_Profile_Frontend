describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/')
    cy.get('#root button').click();
    cy.get('#email').click();
    cy.get('#email').type('admin@example.com');
    cy.get('#root form > div:nth-child(2)').click();
    cy.get('#password').type('1234');
    cy.get('#root button[type="submit"]').click();
    cy.wait(2000)
    cy.get('#root button:nth-child(3)').click();
    cy.get('tr:nth-child(2) [data-testid="EditIcon"]').click();
    cy.get('[name="address"]').click();
    cy.get('[name="address"]').clear();
    cy.get('[name="address"]').type('Herostrasse 12');
    cy.get('[name="birthDate"]').click();
    cy.get('[name="birthDate"]').clear();
    cy.get('[name="birthDate"]').type('2000-03-29');
    cy.get('div[role="dialog"] > div:nth-child(2)').click();
    cy.get('[name="email"]').clear();
    cy.get('[name="email"]').type('tylerdurden@gmail.com');
    cy.get('[name="firstName"]').click();
    cy.get('[name="firstName"]').clear();
    cy.get('[name="firstName"]').type('tyler');
    cy.get('[name="lastName"]').click();
    cy.get('[name="lastName"]').clear();
    cy.get('[name="lastName"]').type('durden');
    cy.get('div:nth-child(3) > button:nth-child(2)').click();
    cy.get('[data-cy="filter-first-name"]').click();
    cy.get('[data-cy="filter-first-name"]').type('tyl{enter}');
  })
})