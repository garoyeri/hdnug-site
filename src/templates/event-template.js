import React from "react"
import { Row, Col, Container } from "react-bootstrap"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const EventTemplate = ({ data }) => {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, fields, html } = markdownRemark

  return (
    <Layout pageInfo={{ pageName: fields.slug }}>
      <SEO
        title={frontmatter.title || fields.slug}
        keywords={[`gatsby`, `react`, `bootstrap`]}
      />
      <Container className="text-left">
        <Row>
          <Col>
            <h2>{frontmatter.title || fields.slug}</h2>
            <p>
              {frontmatter.date} {frontmatter.time}
            </p>
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
      }
      fields {
        slug
      }
    }
  }
`

export default EventTemplate
