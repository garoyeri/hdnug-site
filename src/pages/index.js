import React from "react"
import { Row, Col, Container, Jumbotron, CardColumns } from "react-bootstrap"
import { graphql } from "gatsby"
import Img from "gatsby-image"

import Layout from "../components/layout"
import SEO from "../components/seo"
import EventCard from "../components/event-card"

const IndexPage = ({ data }) => (
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
    <Container>
      <Row>
        <Col>
          <CardColumns>
            {data.events.edges.map(({ node }) => {
              return (
                <EventCard
                  title={node.frontmatter.title}
                  text={node.excerpt}
                  target={node.fields.slug}
                  date={node.frontmatter.date}
                  time={node.frontmatter.time}
                />
              )
            })}
          </CardColumns>
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
    events: allMarkdownRemark(
      filter: { fields: { collection: { eq: "events" } } }
      sort: { fields: frontmatter___date, order: DESC }
      limit: 6
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            date(formatString: "ddd, MMM D")
            title
            time
          }
          excerpt
        }
      }
    }
  }
`

export default IndexPage
