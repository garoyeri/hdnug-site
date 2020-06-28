import React from "react"
import { Card } from "react-bootstrap"
import PropTypes from "prop-types"
import { Link } from "gatsby"

const EventCard = ({ title, text, target, date, time }) => {
  return (
    <Card className="h-200">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>
          <p>
            {date}{" "}{time}
          </p>
          <p>{text}</p>
          <p>
            <Link className="btn btn-primary" to={target}>
              Learn More
            </Link>
          </p>
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

EventCard.defaultProps = {
  title: "",
  text: "",
  target: "",
  date: "",
  time: "",
}

EventCard.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  target: PropTypes.string,
  date: PropTypes.string,
  time: PropTypes.string,
}

export default EventCard
