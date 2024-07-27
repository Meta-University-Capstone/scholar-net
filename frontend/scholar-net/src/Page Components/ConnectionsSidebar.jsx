import React from "react";
import ConnectionsList from './ConnectionsList'
import './ConnectionsSidebar.css'

function ConnectionsSidebar(props) {

    return (
        <nav className={props.isOpen ? 'sidebar open' : 'sidebar'}>
          <ul>
            <li>Connections</li>
            <div className="connections-list">
                <ConnectionsList userID={props.userID}/>
            </div>
          </ul>
          <button onClick={props.toggle}>Close</button>
        </nav>
      );
}

export default ConnectionsSidebar
