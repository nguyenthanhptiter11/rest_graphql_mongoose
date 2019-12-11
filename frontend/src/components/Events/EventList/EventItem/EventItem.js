import React from 'react';

import './EventItem.css';

import FadeInSection from '../../../FadeInSection/FadeInSection';

const eventItem = props => (
  /** <li key={props.eventId} className="events__list-item">
   <div className="events__list-item-box"> 
    <div>
      <h1>{props.title}</h1>
      <h2>
        ${props.price} - {new Date(props.date).toLocaleDateString()}
      </h2>
    </div>
    <div>
      {props.userId === props.creatorId ? (
        <p>Your the owner of this event.</p>
      ) : (
        <button className="btn" onClick={props.onDetail.bind(this, props.eventId)}>
          View Details
        </button>
      )}
    </div>
    </div>
  </li> */
  <li key={props.eventId} className="events__list-item">
    <FadeInSection>
      <div className="events__list-item-box">  
        <div>
          <h1>{props.title}</h1>
          <h2>
            ${props.price} - {new Date(props.date).toLocaleDateString()}
          </h2>
        </div>
        <div>
          {props.userId === props.creatorId ? (
            <p>Your the owner of this event.</p>
          ) : (
            <button className="btn" onClick={props.onDetail.bind(this, props.eventId)}>
              View Details
            </button>
          )}
        </div>
      </div>
    </FadeInSection>
  </li>
);

export default eventItem;
