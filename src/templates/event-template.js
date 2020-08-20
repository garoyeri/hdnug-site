import React from "react"
import { Row, Col, Container } from "react-bootstrap"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Header from "../components/header"

const EventTemplate = ({ data, pageContext }) => {
  const { ugEvent } = data
  const { next, previous } = pageContext

  return (
    <Layout pageInfo={{ pageName: ugEvent.slug }}>
      <SEO
        title={ugEvent.title || ugEvent.slug}
        keywords={[`gatsby`, `react`, `bootstrap`]}
      />
      <Header title={ugEvent.title || ugEvent.slug}>
        <p>
          {ugEvent.date} {ugEvent.time}
        </p>
        <ul>
          {ugEvent.presenters.map(p => (
            <li>
              {p.name}{" "}
              {p.twitter && (
                <a
                  rel="nofollow"
                  target="_self"
                  href={`https://twitter.com/${p.twitter}`}
                >
                  @{p.twitter}
                </a>
              )}{" "}
              {p.web && (
                <a rel="nofollow" target="_self" href={p.web}>
                  {p.web}
                </a>
              )}
            </li>
          ))}
        </ul>
      </Header>
      <Container className="text-left">
        <Row>
          <Col>
            <div
              className="text-left"
              dangerouslySetInnerHTML={{ __html: ugEvent.childMarkdownRemark.html }}
            />
          </Col>
        </Row>
        <Row className="mt-5 mb-5">
          <Col>
            {next && (
              <>
                Next: <Link to={next.slug}>{next.title}</Link>
              </>
            )}
          </Col>
          <Col>
            {previous && (
              <>
                Previous: <Link to={previous.slug}>{previous.title}</Link>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($slug: String!) {
    ugEvent(slug: { eq: $slug }) {
      slug
      date(formatString: "MMMM DD, YYYY")
      time
      title
      presenters {
        name
        twitter
        website
      }
    }
  }
`

export default EventTemplate
