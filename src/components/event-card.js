import React from "react"
import { Card } from "react-bootstrap"
import PropTypes from "prop-types"
import { Link } from "gatsby"

const EventCard = ({ title, presenter, text, target, date, time }) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title><Link to={target}>{title}</Link></Card.Title>
        <div>
          <p>
            {presenter?.name && (
              <i>Presented by: {presenter?.name}</i>
            )}            
          </p>
          <p>
            {date} {time}
          </p>
          <p>{text}</p>
          <p>
            <Link className="btn btn-primary" to={target}>
              Details
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
  presenter: {},
}

EventCard.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  target: PropTypes.string,
  date: PropTypes.string,
  time: PropTypes.string,
  presenter: PropTypes.shape({
    name: PropTypes.string,
    twitter: PropTypes.string,
    website: PropTypes.string,
  }),
}

export default EventCard
