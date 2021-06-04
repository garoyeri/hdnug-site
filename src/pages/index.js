import React from "react"
import { Row, Col, Container, Jumbotron, CardColumns } from "react-bootstrap"
import { graphql } from "gatsby"
import { GatsbyImage, getSrc, getImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import SEO from "../components/seo"
import EventCard from "../components/event-card"

const IndexPage = ({ data }) => {
  const { headingBackground } = data
  return (
    <Layout pageInfo={{ pageName: "index" }}>
      <SEO title="Home" keywords={[`gatsby`, `react`, `bootstrap`]} />
      <section>
        <Jumbotron
          className="text-white"
          fluid
          style={{
            background: `linear-gradient(to bottom, rgba(35,35,35,0.8) 0%,rgba(35,35,35,0.8) 100%), url(${getSrc(headingBackground)})`,
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
                  Development Platform in the Houston Technology Marketplace
                  with our members, who are both individuals and corporations.
                </p>
              </Col>
              <Col md={4} lg={2} className="d-none d-md-block">
                <GatsbyImage
                  image={getImage(data.logo)}
                />
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
                      title={node.title}
                      text={node.excerpt}
                      target={node.slug}
                      date={node.date}
                      time={node.time}
                      presenter={node.presenter}
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
}

export const pageQuery = graphql`
  {
    logo: file(relativePath: { eq: "hdnug-logo-white-text.png" }) {
      childImageSharp {
        gatsbyImageData(width: 600, layout: CONSTRAINED)
      }
    }
    headingBackground: file(relativePath: { eq: "startup-593341_1920.jpg" }) {
      childImageSharp {
        gatsbyImageData(layout: FULL_WIDTH)
      }
    }
    events: allUgEvent(
      filter: { hidden: { ne: true } }
      sort: { fields: date, order: DESC }
      limit: 6
    ) {
      edges {
        node {
          id
          slug
          date(formatString: "ddd, MMM D")
          title
          excerpt
          time
          presenter {
            name
            twitter
            website
          }
        }
      }
    }
  }
`

export default IndexPage
