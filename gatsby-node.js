/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const { createFilePath } = require("gatsby-source-filesystem")

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  const typeDefs = `
    """
    UgPerson: a presenter or officer referenced in a page
    """
    type UgPerson implements Node @infer {
      name: String!
      email: String!
      website: String
      twitter: String
      github: String
      linkedin: String
      image: File @fileByRelativePath
      bio: String
      slug: String!
      hidden: Boolean
    }
  
    """
    UgEvent: event hosted by the user group
    """
    type UgEvent implements Node @infer {
      title: String!
      presenters: [UgPerson!]! @link
      date: Date! @dateformat
      time: String!
      image: File @fileByRelativePath
      abstract: String!
      content: String!
      slug: String!
      hidden: Boolean
    }

    """
    UgSponsor: sponsor for events or generally
    """
    type UgSponsor implements Node @infer {
      name: String!
      website: String!
      email: String
      image: File @fileByRelativePath
      summary: String
      slug: String!
      hidden: Boolean
    }
  `

  createTypes(typeDefs)
}

exports.onCreateNode = ({ node, actions, getNode, createNodeId, createContentDigest, reporter }) => {
  const { createNode, createNodeField } = actions
  const people = "people", sponsors = "sponsors", events = "events"

  if (node.internal.type === `MarkdownRemark`) {
    // Get the parent node
    const parent = getNode(node.parent)

    reporter.info(`encountered: ${parent.sourceInstanceName}`)

    const slug = createFilePath({ node, getNode, basePath: `content` })
    const slugUrl = `/${parent.sourceInstanceName}${slug}`

    switch (parent.sourceInstanceName) {
      case people:
        const person = generatePerson(node)
        createNode({
          ...person,
          id: createNodeId(`person-${person.name}${person.email}`),
          slug: slugUrl,
          // parent: node.id,
          internal: {
            type: `UgPerson`,
            contentDigest: createContentDigest(person),
          },
          children: [node.id],
        })
        break
      case sponsors:
        const sponsor = generateSponsor(node)
        createNode({
          ...sponsor,
          id: createNodeId(`sponsor-${sponsor.name}${sponsor.website}`),
          slug: slugUrl,
          // parent: node.id,
          internal: {
            type: `UgSponsor`,
            contentDigest: createContentDigest(sponsor),
          },
          children: [node.id],
        })
        break
      case events:
        const event = generateEvent(node)
        createNode({
          ...event,
          id: createNodeId(`event-${event.title}${event.date}`),
          slug: slugUrl,
          // parent: node.id,
          internal: {
            type: `UgEvent`,
            contentDigest: createContentDigest(event),
          },
          children: [node.id],
        })
        break
    }
  }
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const eventTemplate = require.resolve(`./src/templates/event-template.js`)
  const events = await graphql(`
    {
      allUgEvent(sort: {fields: date, order: DESC}) {
        edges {
          node {
            id
            title
            slug
          }
          next {
            title
            slug
          }
          previous {
            title
            slug
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
  events.data.allUgEvent.edges.forEach(({ node, next, previous }) => {
    createPage({
      path: node.slug,
      component: eventTemplate,
      context: {
        // additional data can be passed via context
        slug: node.slug,
        next: next
          ? { slug: next.slug, title: next.title }
          : null,
        previous: previous
          ? { slug: previous.slug, title: previous.title }
          : null,
      },
    })
  })
}

function generatePerson(node) {
  return {
    ...node.frontmatter,
    email: node.frontmatter.email.toLowerCase(),
    website: node.frontmatter.website.toLowerCase(),
    hidden: node.hidden || false,
  }
}

function generateSponsor(node) {
  return {
    ...node.frontmatter,
    website: node.frontmatter.website.toLowerCase(),
    hidden: node.hidden || false,
  }
}

function generateEvent(node) {
  return {
    ...node.frontmatter,
    hidden: node.hidden || false,
  }
}
