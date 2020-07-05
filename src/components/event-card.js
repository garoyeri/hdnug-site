import React from "react"
import { Card } from "react-bootstrap"
import PropTypes from "prop-types"
import { Link } from "gatsby"

const EventCard = ({ title, presenters, text, target, date, time }) => {
  const presenterList = presenters.map(s => s.name).join(", ")
  return (
    <Card>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <div>
          <p>
            <i>Presented by: {presenterList}</i>
          </p>
          <p>
            {date} {time}
          </p>
          <p>{text}</p>
          <p>
            <Link className="btn btn-primary" to={target}>
              Learn More
            </Link>
          </p>
        </div>
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
  presenters: [],
}

EventCard.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  target: PropTypes.string,
  date: PropTypes.string,
  time: PropTypes.string,
  presenters: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      twitter: PropTypes.string,
      web: PropTypes.string,
    })
  ),
}

export default EventCard
