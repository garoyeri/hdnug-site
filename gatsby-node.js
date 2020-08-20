/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const { createFilePath } = require("gatsby-source-filesystem")

const peopleSource = "people",
  sponsorsSource = "sponsors",
  eventsSource = "events"

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
      time: String
      image: File @fileByRelativePath
      excerpt: String!
      content: String
      slug: String!
      website: String
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

exports.onCreateNode = ({
  node,
  actions,
  getNode,
  createNodeId,
  createContentDigest,
  reporter,
}) => {
  const { createNode, createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    // Get the parent node
    const parent = getNode(node.parent)

    reporter.info(`encountered: ${parent.sourceInstanceName}`)

    const slug = createFilePath({ node, getNode, basePath: `content` })
    const slugUrl = `/${parent.sourceInstanceName}${slug}`

    switch (parent.sourceInstanceName) {
      case peopleSource:
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
      case sponsorsSource:
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
      case eventsSource:
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
  const { createPage, createNode, createNodeId } = actions

  // layer XML, Meetup, and Markdown to be Events
  const xmlEventsSource = await graphql(`
    {
      allHdnugXml {
        edges {
          node {
            id
            xmlChildren {
              name
              content
            }
          }
        }
      }
    }
  `)
  if (xmlEventsSource.errors) {
    reporter.panicOnBuild(
      `Error while running GraphQL query.`,
      xmlEventsSource.errors
    )
    return
  }
  const xmlEvents = xmlEventsSource.data.allHdnugXml.edges.map(n => {
    const rawEvent = {
      id: n.node.id,
      ...n.node.xmlChildren.map(e => {
        return { [e.name]: e.content }
      }),
    }

    return {
      xml_id: rawEvent.id,
      date: rawEvent.MeetingDate,
      title: rawEvent.Title,
      excerpt: rawEvent.SessionAbstract,
      speaker: {
        name: `${rawEvent.SpeakerFirstName} ${rawEvent.SpeakerLastName}`,
        bio: rawEvent.AboutSpeaker,
      },
      sponsor: {
        name: rawEvent.SponsorName,
        website: rawEvent.SponsorUrl,
        summary: rawEvent.SponsorMessage,
      },
    }
  })

  const meetupEventsSource = await graphql(`
    {
      allMeetupEvent {
        edges {
          node {
            description
            featured_photo {
              photo_link
              highres_link
            }
            local_date
            local_time
            name
            link
          }
        }
      }
    }
  `)
  if (meetupEventsSource.errors) {
    reporter.panicOnBuild(
      `Error while running GraphQL query.`,
      meetupEventsSource.errors
    )
    return
  }
  const meetupEvents = meetupEventsSource.data.allMeetupEvent.edges.map(n => {
    return {
      meetup_id: n.node.id,
      date: n.node.local_date,
      time: n.node.local_time,
      title: n.node.name,
      website: n.node.link,
      image: n.node.featured_photo && n.node.featured_photo.highres_link,
    }
  })

  const markdownFilesSource = await graphql(`
    {
      allMarkdownRemark(filter: { frontmatter: { hidden: { ne: true } } }) {
        edges {
          node {
            parent {
              id
              ... on File {
                sourceInstanceName
              }
            }
            id
            excerpt
            frontmatter {
              date
              email
              excerpt
              presenters {
                name
                email
                twitter
                website
                github
                linkedin
              }
              title
              hidden
            }
            html
          }
        }
      }
    }
  `)
  if (markdownFilesSource.errors) {
    reporter.panicOnBuild(
      `Error while running GraphQL query.`,
      markdownFilesSource.errors
    )
    return
  }
  const markdownEvents = markdownFilesSource.data.allMarkdownRemark.edges
    .filter(n => n.node.parent.sourceInstanceName === eventsSource)
    .map(n => {
      return {
        markdown_id: n.node.id,
        date: n.node.frontmatter.date,
        time: n.node.frontmatter.time,
        title: n.node.frontmatter.title,
        excerpt: n.node.frontmatter.excerpt || n.node.excerpt,
        content: n.node.html,
        presenters: n.node.presenters,
      }
    })

  const eventTemplate = require.resolve(`./src/templates/event-template.js`)
  const events = await graphql(`
    {
      allUgEvent(sort: { fields: date, order: DESC }) {
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
        next: next ? { slug: next.slug, title: next.title } : null,
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
