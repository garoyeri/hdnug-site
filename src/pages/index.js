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
    <section>
      <Jumbotron
        className="text-white"
        fluid
        style={{
          background: `linear-gradient(to bottom, rgba(35,35,35,0.8) 0%,rgba(35,35,35,0.8) 100%), url(${data.headingBackground.childImageSharp.fluid.src})`,
        }}
      >
        <Container>
          <Row>
            <Col xs={12} md={8} lg={10}>
              <h1>Houston .NET Users Group</h1>
              <p>
                To explore, examine, develop and advance applications and
                services built with the .Net Development platform. Effectively
                aiding the widespread learning and sharing of the .Net
                Development Platform in the Houston Technology Marketplace with
                our members, who are both individuals and corporations.
              </p>
            </Col>
            <Col md={4} lg={2} className="d-none d-md-block">
              <Img fluid={data.logo.childImageSharp.fluid} />
            </Col>
          </Row>
        </Container>
      </Jumbotron>
    </section>
    <section>
      <Container>
        <Row>
          <Col>
            <CardColumns>
              {data.events.edges.map(({ node }) => {
                return (
                  <EventCard
                    key={node.id}
                    title={node.frontmatter.title}
                    text={node.frontmatter.excerpt || node.excerpt}
                    target={node.fields.slug}
                    date={node.frontmatter.date}
                    time={node.frontmatter.time}
                    presenters={node.frontmatter.presenters}
                  />
                )
              })}
            </CardColumns>
          </Col>
        </Row>
      </Container>
    </section>
  </Layout>
)

export const pageQuery = graphql`
  query {
    logo: file(relativePath: { eq: "hdnug-logo-white-text.png" }) {
      childImageSharp {
        fluid(maxWidth: 600) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    headingBackground: file(relativePath: { eq: "startup-593341_1920.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 1920) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    events: allMarkdownRemark(
      filter: {
        fields: { collection: { eq: "events" } }
        frontmatter: { hidden: { ne: true } }
      }
      sort: { fields: frontmatter___date, order: DESC }
      limit: 6
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            date(formatString: "ddd, MMM D")
            title
            excerpt
            time
            presenters {
              name
              twitter
              web
            }
          }
          excerpt
        }
      }
    }
  }
`

export default IndexPage
