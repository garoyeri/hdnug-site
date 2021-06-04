import React from "react"
import { Row, Col, Container, Jumbotron, Table } from "react-bootstrap"
import { graphql, Link } from "gatsby"
import { getSrc } from "gatsby-plugin-image"

import Layout from "../components/layout"
import SEO from "../components/seo"

const PastEventsPage = ({ data }) => {
  const { headingBackground } = data
  return (
    <Layout pageInfo={{ pageName: "past-events" }}>
      <SEO title="Past Events" keywords={[`gatsby`, `react`, `bootstrap`]} />
      <Jumbotron
        className="text-white"
        fluid
        style={{
          background: `linear-gradient(to bottom, rgba(35,35,35,0.8) 0%,rgba(35,35,35,0.8) 100%), url(${getSrc(headingBackground)})`,
        }}
      >
        <Container>
          <Row>
            <Col>
              <h1>Past User Group Events</h1>
            </Col>
          </Row>
        </Container>
      </Jumbotron>
      <Container>
        <Row>
          <Col>
            <Table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                </tr>
              </thead>
              <tbody>
                {data.events.edges.map(({ node }) => {
                  // console.log("Node Found", node)
                  return (
                    <tr key={node.slug}>
                      <td>
                        <nobr>{node.date}</nobr>
                      </td>
                      <td>
                        <Link to={node.slug}>
                          {node.title}
                        </Link>
                        <dl>
                          <dd>{node.presenter.name}</dd>
                        </dl>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export const pageQuery = graphql`{
  events: allUgEvent(
    filter: {hidden: {ne: true}}
    sort: {fields: date, order: DESC}
  ) {
    edges {
      node {
        slug
        date(formatString: "ddd, MMM D, YYYY")
        title
        time
        excerpt
        presenter {
          name
          twitter
          website
        }
      }
    }
  }
  headingBackground: file(relativePath: {eq: "programming-1873854_1920.png"}) {
    childImageSharp {
      gatsbyImageData(layout: FULL_WIDTH)
    }
  }
}
`

export default PastEventsPage
