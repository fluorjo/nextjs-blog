describe('homepage test', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('사이드바', () => {
    cy.get('[data-cy="sidebarToggle"]').click();

    cy.contains('HOME');
    cy.contains('TAG');

    cy.get('[data-cy="githubLink"]').should(
      'have.attr',
      'href',
      'https://github.com/fluorjo',
    );
  });

  it('글 목록', () => {
    cy.get('a[href*="/posts/"]').first().click();
    cy.url().should('include', '/posts/');
  });
  
  it('푸터', () => {
    cy.contains('ABOUT ME');
    cy.contains('fluorjo');
    cy.get('[data-cy="adminLink"]').click();
    cy.url().should('include', '/admin');
    cy.get('[data-cy="writeLink"]').click();
    cy.url().should('not.be.a', '/write');
  });
})