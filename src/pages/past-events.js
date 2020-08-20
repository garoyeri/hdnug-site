import React from "react"
import { Row, Col, Container, Jumbotron, Table } from "react-bootstrap"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const PastEventsPage = ({ data }) => {
  console.log("Past Events Data", data)
  return (
    <Layout pageInfo={{ pageName: "past-events" }}>
      <SEO title="Past Events" keywords={[`gatsby`, `react`, `bootstrap`]} />
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
                  <th>Summary</th>
                </tr>
              </thead>
              <tbody>
                {data.events.edges.map(({ node }) => {
                  // console.log("Node Found", node)
                  return (
                    <tr>
                      <td>
                        <nobr>{node.date}</nobr>
                      </td>
                      <td>
                        <Link to={node.slug}>
                          {node.title}
                        </Link>
                        <dl>
                        {node.presenters.map(item => (
                          <dd>{item.name}</dd>
                        ))}
                        </dl>
                      </td>
                      <td>{node.excerpt}</td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    events: allUgEvent(
      filter: {
        hidden: { ne: true }
      }
      sort: { fields: date, order: DESC }
    ) {
      edges {
        node {
          slug
          date(formatString: "ddd, MMM D")
          title
          time
          excerpt
          presenters {
            name
            twitter
            website
          }
        }
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

export default PastEventsPage
