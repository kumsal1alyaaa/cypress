import { HeaderBarFragmentDoc } from '../generated/graphql-test'
import HeaderBar from './HeaderBar.vue'
import { defaultMessages } from '@cy/i18n'

const text = defaultMessages.topNav

describe('<HeaderBar />', { viewportWidth: 1000, viewportHeight: 750 }, () => {
  it('renders with functional browser menu when show-browsers prop is true', () => {
    cy.mountFragment(HeaderBarFragmentDoc, {
      onResult: (result, ctx) => {
        result.app.activeProject = null
      },
      render: (gqlVal) => <div class="resize overflow-auto border-current border-1 h-700px"><HeaderBar gql={gqlVal} show-browsers={true} /></div>,
    })

    cy.get('[data-cy="topnav-browser-list"]')
      .should('be.visible')
      .click()

    cy.contains('Edge Canary')
      .should('be.visible')
  }),

    it('renders without browser menu by default and other items work', () => {
      cy.mountFragment(HeaderBarFragmentDoc, {
        render: (gqlVal) => <div class="resize overflow-auto border-current border-1 h-700px"><HeaderBar gql={gqlVal} /></div>,
      })

      cy.get('[data-cy="topnav-browser-list"]').should('not.exist')
      cy.contains('button', text.docsMenu.docsHeading).click()
      cy.contains('a', text.docsMenu.firstTest).should('be.visible')
      cy.get('[data-cy="topnav-version-list"]').click()
      cy.contains('a', text.docsMenu.firstTest).should('not.exist')
      cy.contains('a', text.seeAllReleases).should('be.visible')
    })

  it('displays the active project name', () => {
    cy.mountFragment(HeaderBarFragmentDoc, {
      render: (gqlVal) => <div class="resize overflow-auto border-current border-1 h-700px"><HeaderBar gql={gqlVal} /></div>,
    })

    cy.contains('test-project').should('be.visible')
  })

  it('the login modal reaches "opening browser" status', () => {
    cy.mountFragment(HeaderBarFragmentDoc, {
      render: (gqlVal) => <div class="resize overflow-auto border-current border-1 h-700px"><HeaderBar gql={gqlVal} /></div>,
    })
    cy.findByRole('button', { name: text.login.actionLogin })
      .click()

    cy.contains('h2', text.login.titleInitial).should('be.visible')
    cy.findByRole('button', { name: defaultMessages.actions.close }).should('be.visible').and('have.focus')

    // just grabbing a small fragment of the body text since it has some dynamically replacable content
    cy.contains(text.login.bodyInitial.slice(0, 10)).should('be.visible')

    // begin the login process
    cy.findByRole('button', { name: text.login.actionLogin }).click()

    // ensure we reach "browser is opening" status on the CTA
    cy.findByRole('button', { name: text.login.actionOpening })
      .should('be.visible')
      .and('be.disabled')
  })

  it.only('the logged in state is correctly presented in header', () => {

    const cloudViewer = {
      id: "1",
      email: 'test@test.test',
      fullName: 'Tester Test',
    }

    cy.mountFragment(HeaderBarFragmentDoc, {
      onResult: (result) => {
        result.__typename = "Query"
        result.app.isAuthBrowserOpened = true
        result.cloudViewer = cloudViewer
        result.cloudViewer.__typename = 'CloudUser'
      },
      render: (gqlVal) => <div class="resize overflow-auto border-current border-1 h-700px"><HeaderBar gql={gqlVal} /></div>,
    })
    cy.findByRole('button', { name: text.login.actionLogin }).click()
    cy.contains(cloudViewer.fullName).should('be.visible')
    cy.contains(cloudViewer.email).should('be.visible')
    cy.findByRole('button', { name: text.login.actionLogout }).click()

  })

})


