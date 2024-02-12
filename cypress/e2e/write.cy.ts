describe('글쓰기 페이지 테스트', () => {
    beforeEach(() => {
      cy.visit('/admin');
      // cypress에서 더 안전하게 인증정보 처리하는 방법들 있음. 찾아서 해보기.
      cy.get('button[type="submit"]').click();
      cy.contains('글 쓰러 가기').click();
      cy.url().should('include', '/write');
    });
  
    it('글 작성', () => {
      cy.get('input[placeholder="제목"]').type('테스트 글 제목');
      cy.get('input#category').type('Test{enter}');
      cy.get('input#tags').type('Test{enter}');
      cy.get('textarea').type('# 테스트 글 내용');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/posts/');
    });
  
    // 테스트로 만들어진 글 삭제
    afterEach(() => {
      cy.visit('/admin');
      cy.contains('테스트 글 삭제').click();
      cy.clearAllCookies();
    });
  });