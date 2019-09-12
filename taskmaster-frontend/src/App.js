import React, {useState, useEffect} from 'react';
import './reset.css';
import './App.css';

const API = "http://taskmaster-backend.us-west-2.elasticbeanstalk.com/api/v1"

function App() {

  const [tasks, setTasks] = useState([]);

  function _getTasks() {
    fetch(API + "/tasks")
      .then( data => data.json() )
      .then( fetchedTasks => setTasks(fetchedTasks) );
  }

  useEffect( _getTasks, [] );

  return (
    <div className="app">
      <nav>
        <h1>Taskmaster</h1>
      </nav>
      <main>
        <ul>
          {tasks.map( (task,idx) => {
            return (
              <li key={task.id}>
                <details>
                  <summary className="flex summary-container">
                    <div className="summary">
                      <h2>{task.title}</h2>
                      <p>{task.description}</p>
                    </div>
                  </summary>
                  <History history={task.history} />
                </details>
              </li>
            )
          })}
        </ul>
      </main>
    </div>
  );
}

function History(props) {
  return (
    <ol className="details">
      {props.history.map( (record,idx) => {
        return (
          <li key={idx}>
            <span>{record.action} @ </span>
            <span>{record.time} </span>
          </li>
        )
      })}
    </ol>
  )
}

export default App;
