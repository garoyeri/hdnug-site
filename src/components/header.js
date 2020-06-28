import PropTypes from "prop-types"
import React from "react"
import { Jumbotron, Container, Row, Col } from "react-bootstrap"

const Header = ({ title, children }) => (
  <Jumbotron fluid>
    <Container>
      <Row>
        <Col>
          <h1>{title}</h1>
          {children || ""}
        </Col>
      </Row>
    </Container>
  </Jumbotron>
)

Header.propTypes = {
  title: PropTypes.string,
}

Header.defaultProps = {
  title: ``,
}

export default Header
