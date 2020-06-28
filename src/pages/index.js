import React from "react"
import { Row, Col, Container, ListGroup, Jumbotron } from "react-bootstrap"
import { graphql } from "gatsby"
import Img from "gatsby-image"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = ({data}) => (
  <Layout pageInfo={{ pageName: "index" }}>
    <SEO title="Home" keywords={[`gatsby`, `react`, `bootstrap`]} />
    <Jumbotron fluid>
      <Container>
        <Row>
          <Col xs={12} md={8} lg={10}>
            <h1>Houston .NET Users Group</h1>
            <p>
              To explore, examine, develop and advance applications and services
              built with the .Net Development platform. Effectively aiding the
              widespread learning and sharing of the .Net Development Platform
              in the Houston Technology Marketplace with our members, who are
              both individuals and corporations.
            </p>
          </Col>
          <Col md={4} lg={2} className="d-none d-md-block">
            <Img fluid={data.logo.childImageSharp.fluid} />
          </Col>
        </Row>
      </Container>
    </Jumbotron>
    <Container className="text-center">
      <Row>
        <Col>
          <p>
            This is a Gatsby Starter that I frequently use to get jump started
            on quick website builds. It includes the following packages:
          </p>
        </Col>
      </Row>
      <Row className="justify-content-center my-3">
        <Col md="6">
          <ListGroup>
            <ListGroup.Item
              action
              href="https://getbootstrap.com"
              target="_blank"
            >
              Bootstrap
            </ListGroup.Item>
            <ListGroup.Item
              action
              href="https://react-bootstrap.github.io/"
              target="_blank"
            >
              react-bootstrap
            </ListGroup.Item>
            <ListGroup.Item
              action
              href="https://react-icons.netlify.com"
              target="_blank"
            >
              react-icons
            </ListGroup.Item>
            <ListGroup.Item
              action
              href="https://www.gatsbyjs.org/packages/gatsby-plugin-sass/"
              target="_blank"
            >
              gatsby-plugin-sass
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            This starter also includes a navbar that sticks to the top of the
            screen when the user scrolls past it, and a footer that stays at the
            bottom of the screen.
          </p>
          <p>
            For more documentation on these packages and how they work, please
            refer to the pages linked in the list above.
          </p>
        </Col>
      </Row>
    </Container>
  </Layout>
)

export const pageQuery = graphql`
  query {
    logo: file(relativePath: { eq: "hdnug-logo-black-text.png" }) {
      childImageSharp {
        fluid(maxWidth: 600) {
          ...GatsbyImageSharpFluid
        }
      }
    }    
  }
`

export default IndexPage
