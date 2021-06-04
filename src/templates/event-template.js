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
          background: `linear-gradient(to bottom, rgba(35,35,35,0.8) 0%,rgba(35,35,35,0.8) 100%), url(${data.headingBackground.childImageSharp.gatsbyImageData.src})`,
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
            {ugEvent.website && (
              <>
                <h2>Meetup: <a href={ugEvent.website}>Register for this Event</a></h2>
              </>
            )}
            {ugEvent.excerpt && !ugEvent.content && (
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
            {ugEvent.youtube && (
              <>
                <h2>Presentation Recording</h2>
                <iframe
                  width="560"
                  height="315"
                  src={"https://www.youtube.com/embed/" + ugEvent.youtube}
                  title={ugEvent.title}
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </>
            )}
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
  );
}

export const pageQuery = graphql`query ($slug: String!) {
  ugEvent(slug: {eq: $slug}) {
    slug
    date(formatString: "MMMM DD, YYYY")
    time
    title
    excerpt
    content
    website
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
    youtube
  }
  headingBackground: file(relativePath: {eq: "programming-1873854_1920.png"}) {
    childImageSharp {
      gatsbyImageData(layout: FULL_WIDTH)
    }
  }
}
`

export default EventTemplate
