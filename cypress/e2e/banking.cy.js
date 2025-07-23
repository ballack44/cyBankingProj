describe('Banking App Test - Deposit and Balance Verification', () => {
  const baseUrl = 'https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login';

  it('Logs in, deposits amounts, and verifies balance', () => {
    // Visit the login page
    cy.visit(baseUrl);

    // Click on "Customer Login"
    cy.contains('Customer Login').click();

    // Select 'Harry Potter' from dropdown and click Login
    cy.get('select#userSelect').select('Harry Potter');
    cy.get('button[type="submit"]').click();
	
    // Array of deposit amounts
    const deposits = [100, 10, 5];

    // Perform deposits
    deposits.forEach(amount => {
      cy.contains('Deposit').click();
      cy.get('input[ng-model="amount"]').clear().type(amount);
      cy.get('button[type="submit"]').click();

      // Check confirmation message
      cy.get('.error').should('contain.text', 'Deposit Successful');
    });

    // Verify the final balance
    const expectedBalance = deposits.reduce((a, b) => a + b, 0); // 115
    cy.get('.center strong').eq(1).should('have.text', expectedBalance.toString());
	
    // Navigate to Transactions
    // Add a wait to let state update (can remove if flaky only)
    cy.wait(1000);

    // Click Transactions and force it in case it's not interactable
    cy.contains('Transactions').click({ force: true });
	
    // Diagnostic step: check if ANY rows show up
    cy.get('table')
      .should('exist')
      .within(() => {
        cy.get('tr').should('have.length.greaterThan', 1); // header + at least 1 transaction
      });

    // Calculate transaction amount total
    cy.get('table tr')
      .then($rows => {
        const dataRows = Array.from($rows).slice(1); // skip header row
        const amounts = dataRows.map(row => parseInt(row.cells[1].innerText));
        const sum = amounts.reduce((a, b) => a + b, 0);
        expect(sum).to.eq(expectedBalance);
      });
  });
});
