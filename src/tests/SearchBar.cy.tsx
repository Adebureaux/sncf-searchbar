import React from 'react'
import SearchBar from '../pages/SearchBar'

describe('<SearchBar />', () => {

	beforeEach(() => {
		cy.mount(<SearchBar />)
	  });

	it('displays popular cities by clicking the input bar', () => {
		cy.get('[data-testid="search-input"]').click();
		cy.get('[data-testid="popular-cities"]').should('exist');
	});

	it('displays autocomplete results after entering at least two characters', () => {
		cy.get('[data-testid="search-input"]').type('par');
		cy.get('[data-testid="autocomplete-results"]').should('exist');
	});

	it('displays "Recherche avancée" when there are no autocomplete results', () => {
		cy.get('[data-testid="search-input"]').type('abcdefghij');
		cy.get('[data-testid="no-results"]').should('exist');
	});

	it('displays disabled destination input when submiting the form', () => {
		cy.get('[data-testid="search-btn"]').click();
		cy.get('[data-testid="disabled-input"]').should('exist');
		cy.get('[data-testid="search-input"]').should('exist');
	});

})