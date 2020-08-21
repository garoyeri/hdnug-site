/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const { createFilePath } = require("gatsby-source-filesystem")
const moment = require("moment")
const slugify = require("slugify")

const peopleSource = "people",
  sponsorsSource = "sponsors",
  eventsSource = "events"

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  const typeDefs = `
    """
    UgPerson: a presenter or officer referenced in a page
    """
    type UgPerson {
      name: String!
      email: String
      website: String
      twitter: String
      github: String
      linkedin: String
      image: File @fileByRelativePath
      bio: String
      slug: String
      hidden: Boolean
    }
  
    """
    UgEvent: event hosted by the user group
    """
    type UgEvent implements Node @infer {
      title: String!
      date: Date! @dateformat
      time: String
      image: File @fileByRelativePath
      excerpt: String!
      content: String
      slug: String!
      website: String
      presenter: UgPerson
      sponsor: UgSponsor
      hidden: Boolean
    }

    """
    UgSponsor: sponsor for events or generally
    """
    type UgSponsor {
      name: String
      website: String
      email: String
      image: File @fileByRelativePath
      summary: String
      slug: String
      hidden: Boolean
    }
  `

  createTypes(typeDefs)
}

exports.createPages = async ({
  actions,
  graphql,
  reporter,
  createNodeId,
  createContentDigest,
}) => {
  const { createPage, createNode } = actions

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
    }
    n.node.xmlChildren.map(e => {
      rawEvent[e.name] = e.content
    })

    return {
      source: "xml",
      xml_id: rawEvent.id,
      date: extractDay(rawEvent.MeetingDate),
      title: rawEvent.Title,
      excerpt: rawEvent.SessionAbstract,
      presenter: {
        name: `${rawEvent.SpeakerFirstName || ""} ${
          rawEvent.SpeakerLastName || ""
        }`.trim(),
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
      source: "meetup",
      meetup_id: n.node.id,
      date: n.node.local_date,
      time: n.node.local_time,
      title: n.node.name,
      website: n.node.link,
      content: n.node.description,
      image: n.node.featured_photo && n.node.featured_photo.highres_link,
      presenter: {},
      sponsor: {},
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
              time
              email
              excerpt
              title
              hidden
              presenter {
                name
                email
                website
              }
              sponsor {
                name
                website
              }
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
        source: "markdown",
        markdown_id: n.node.id,
        date: extractDay(n.node.frontmatter.date),
        time: n.node.frontmatter.time,
        title: n.node.frontmatter.title,
        excerpt: n.node.frontmatter.excerpt || n.node.excerpt,
        content: n.node.html,
        presenter: n.node.frontmatter.presenter || {},
        sponsor: n.node.frontmatter.sponsor || {},
        hidden: n.node.hidden || false,
      }
    })

  let ugEvents = {}
  xmlEvents.map(x => {
    ugEvents[x.date] = merge(null, x)
  })
  meetupEvents.map(x => {
    ugEvents[x.date] = merge(ugEvents[x.date], x)
  })
  markdownEvents.map(x => {
    ugEvents[x.date] = merge(ugEvents[x.date], x)
  })

  // create nodes from all the events
  for (const [key, value] of Object.entries(ugEvents)) {
    if (!value.title) {
      reporter.info(`title was undefined: ${JSON.stringify(value)}`)
      continue
    }

    createNode({
      ...value,
      id: createNodeId(`event-${value.date}${value.title}`),
      slug:
        `/events/` +
        slugify(`${value.date} ${value.title}`, { lower: true, strict: true }),
      internal: {
        type: `UgEvent`,
        contentDigest: createContentDigest(value),
      },
    })
  }

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
        slug: node.slug,
        // we're swapping these around because we sort by descending order
        previous: next ? { slug: next.slug, title: next.title } : null,
        next: previous
          ? { slug: previous.slug, title: previous.title }
          : null,
      },
    })
  })
}

function extractDay(meetingDate) {
  return moment.utc(meetingDate).format("YYYY-MM-DD")
}

function merge(prev, next) {
  if (!prev) {
    return next
  } else if (!next) {
    return prev
  }

  return {
    ...prev,
    ...next,
    presenter: {
      ...(prev.presenter || {}),
      ...(next.presenter || {}),
    },
    sponsor: {
      ...(prev.sponsor || {}),
      ...(next.sponsor || {}),
    }
  }
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
