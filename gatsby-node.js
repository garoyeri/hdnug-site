/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const { createFilePath } = require("gatsby-source-filesystem")

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    // Get the parent node
    const parent = getNode(node.parent)

    // Create a field on this node for the "collection" of the parent
    // NOTE: This is necessary so we can filter `allMarkdownRemark` by
    // `collection` otherwise there is no way to filter for only markdown
    // documents of type `post`.
    createNodeField({
      node,
      name: `collection`,
      value: parent.sourceInstanceName,
    })

    const slug = createFilePath({ node, getNode, basePath: `content` })
    createNodeField({
      node,
      name: `slug`,
      value: `/events${slug}`,
    })
  }
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const eventTemplate = require.resolve(`./src/templates/event-template.js`)
  const events = await graphql(`
    {
      allMarkdownRemark(filter: { fields: { collection: { eq: "events" } } }) {
        edges {
          node {
            frontmatter {
              title
              date
              hidden
            }
            fields {
              collection
              slug
            }
          }
          next {
            fields {
              slug
            }
            frontmatter {
              title
            }
          }
          previous {
            fields {
              slug
            }
            frontmatter {
              title
            }
          }
        }
      }
    }
  `)
  // Handle errors
  if (events.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }
  events.data.allMarkdownRemark.edges.forEach(({ node, next, previous }) => {
    createPage({
      path: node.fields.slug,
      component: eventTemplate,
      context: {
        // additional data can be passed via context
        ...node.frontmatter,
        ...node.fields,
        next: next ? { slug: next.fields.slug, title: next.frontmatter.title } : null,
        previous: previous ? { slug: previous.fields.slug, title: previous.frontmatter.title } : null,
      },
    })
  })
}
