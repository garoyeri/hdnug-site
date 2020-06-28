import React from "react"
import { Row, Col, Container, Table } from "react-bootstrap"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Header from "../components/header"

const PastEventsPage = ({ data }) => {
  console.log("Past Events Data", data)
  return (
    <Layout pageInfo={{ pageName: "past-events" }}>
      <SEO title="Past Events" keywords={[`gatsby`, `react`, `bootstrap`]} />
      <Header title="Past User Group Events" />
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
      filter: { fields: { collection: { eq: "events" } } }
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
  }
`

export default PastEventsPage
