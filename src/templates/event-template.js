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
          <li>
            {ugEvent.presenter.name}{" "}
            {ugEvent.presenter.twitter && (
              <a
                rel="nofollow"
                target="_self"
                href={`https://twitter.com/${ugEvent.presenter.twitter}`}
              >
                @{ugEvent.presenter.twitter}
              </a>
            )}{" "}
            {ugEvent.presenter.website && (
              <a rel="nofollow" target="_self" href={ugEvent.presenter.website}>
                {ugEvent.presenter.website}
              </a>
            )}
          </li>
        </ul>
      </Header>
      <Container className="text-left">
        <Row>
          <Col>
            {ugEvent.excerpt && (
              <>
                <p dangerouslySetInnerHTML={{ __html: ugEvent.excerpt }} />
              </>
            )}
            {ugEvent.presenter?.summary && (
              <>
                <h2>About {ugEvent.presenter.name}</h2>
                <p
                  dangerouslySetInnerHTML={{
                    __html: ugEvent.presenter.summary,
                  }}
                ></p>
              </>
            )}
            {ugEvent.sponsor?.summary && (
              <>
                <h2>About the sponsor: {ugEvent.sponsor.name}</h2>
                <p
                  dangerouslySetInnerHTML={{
                    __html: ugEvent.sponsor.summary,
                  }}
                />
              </>
            )}
            <div
              className="text-left"
              dangerouslySetInnerHTML={{ __html: ugEvent.content }}
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
      excerpt
      content
      presenter {
        name
        twitter
        website
        summary
      }
      sponsor {
        name
        website
        summary
      }
    }
  }
`

export default EventTemplate
