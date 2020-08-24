import React from "react"
import { Row, Col, Container, Jumbotron } from "react-bootstrap"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const EventTemplate = ({ data, pageContext }) => {
  const { ugEvent } = data
  const { next, previous } = pageContext

  return (
    <Layout pageInfo={{ pageName: ugEvent.slug }}>
      <SEO
        title={ugEvent.title || ugEvent.slug}
        keywords={[`gatsby`, `react`, `bootstrap`]}
      />
      <Jumbotron
        className="text-white"
        fluid
        style={{
          background: `linear-gradient(to bottom, rgba(35,35,35,0.8) 0%,rgba(35,35,35,0.8) 100%), url(${data.headingBackground.childImageSharp.fluid.src})`,
        }}
      >
        <Container>
          <Row>
            <Col>
              <h1>{ugEvent.title}</h1>
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
                    <a
                      rel="nofollow"
                      target="_self"
                      href={ugEvent.presenter.website}
                    >
                      {ugEvent.presenter.website}
                    </a>
                  )}
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </Jumbotron>
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
    headingBackground: file(
      relativePath: { eq: "programming-1873854_1920.png" }
    ) {
      childImageSharp {
        fluid(maxWidth: 1920) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`

export default EventTemplate
