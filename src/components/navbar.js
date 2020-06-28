import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import Img from "gatsby-image"

import { Navbar, Nav } from "react-bootstrap"

const CustomNavbar = ({ pageInfo }) => {
  console.log(pageInfo)

  const data = useStaticQuery(graphql`
    query {
      logo: file(relativePath: { eq: "hdnug-logo-horizontal.png" }) {
        childImageSharp {
          # Specify the image processing specifications right in the query.
          # Makes it trivial to update as your page's design changes.
          fixed(height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `)
  console.log(data)

  return (
    <>
      <Navbar bg="light" variant="light" expand="lg" id="site-navbar">
        {/* <Container> */}
        <Link to="/" className="link-no-style">
          <Navbar.Brand>
            <Img fixed={data.logo.childImageSharp.fixed} />
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" />
          <Nav activeKey={pageInfo && pageInfo.pageName}>
            <Link to="/past-events" className="link-no-style">
              <Nav.Link as="span" eventKey="past-events">
                Past Events
              </Nav.Link>
            </Link>
          </Nav>
        </Navbar.Collapse>
        {/* </Container> */}
      </Navbar>
    </>
  )
}

export default CustomNavbar
