import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image";

import { Navbar, Nav } from "react-bootstrap"

const CustomNavbar = ({ pageInfo }) => {
  console.log(pageInfo)

  const data = useStaticQuery(graphql`{
  logo: file(relativePath: {eq: "hdnug-logo-horizontal.png"}) {
    childImageSharp {
      gatsbyImageData(height: 50, layout: FIXED)
    }
  }
}
`)
  console.log(data)

  return <>
    <Navbar bg="light" variant="light" expand="lg" id="site-navbar">
      {/* <Container> */}
      <Link to="/" className="link-no-style">
        <Navbar.Brand>
          <GatsbyImage image={data.logo.childImageSharp.gatsbyImageData} />
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
  </>;
}

export default CustomNavbar
