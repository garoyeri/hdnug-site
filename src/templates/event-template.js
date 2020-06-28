import React from "react"
import { Row, Col, Container } from "react-bootstrap"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Header from "../components/header"

const EventTemplate = ({ data }) => {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, fields, html } = markdownRemark

  return (
    <Layout pageInfo={{ pageName: fields.slug }}>
      <SEO
        title={frontmatter.title || fields.slug}
        keywords={[`gatsby`, `react`, `bootstrap`]}
      />
      <Header title={frontmatter.title || fields.slug}>
        <p>
          {frontmatter.date} {frontmatter.time}
        </p>
        <ul>
          {frontmatter.presenters.map(p => (
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
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        time
        title
        presenters {
          name
          twitter
          web
        }
      }
      fields {
        slug
      }
    }
  }
`

export default EventTemplate
