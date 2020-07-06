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
                  <th>Presenters</th>
                  <th>Summary</th>
                </tr>
              </thead>
              <tbody>
                {data.events.edges.map(({ node }) => {
                  console.log("Node Found", node)
                  return (
                    <tr>
                      <td>
                        <nobr>{node.frontmatter.date}</nobr>
                      </td>
                      <td>
                        {node.frontmatter.presenters.map(item => (
                          <p>{item.name}</p>
                        ))}
                      </td>
                      <td>
                        <Link to={node.fields.slug}>
                          {node.frontmatter.title}
                        </Link>
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
    events: allMarkdownRemark(
      filter: {
        fields: { collection: { eq: "events" } }
        frontmatter: { hidden: { ne: true } }
      }
      sort: { fields: frontmatter___date, order: DESC }
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
