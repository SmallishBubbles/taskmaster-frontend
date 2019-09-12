import React, {useState, useEffect} from 'react';
import { useInput } from './useInput.js';
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
        <div className="form-container">
          <h3> Create a new task: </h3>
          <TaskForm></TaskForm>
        </div>
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

// https://rangle.io/blog/simplifying-controlled-inputs-with-hooks/
function TaskForm(props) {
  const { value:title, bind:bindTitle, reset:resetTitle } = useInput('');
  const { value:description, bind:bindDescription, reset:resetDescription } = useInput('');
  
  const handleSubmit = (event) => {
      event.preventDefault();
      let newTask = {
        title: title,
        description: description
      }
      console.log(newTask);

      fetch(API + "/tasks", {
        method: "POST",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(newTask)
      })
        .then( data => data.json() )
        .then( fetchedTasks => console.log(fetchedTasks) );

      resetTitle();
      resetDescription();


      // I know this is very bad react. Need to figure out how to change state of app instead.
      window.location.reload(false);
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input type="text" {...bindTitle} />
      </label>
      <label>
        Description:
        <input type="text" {...bindDescription} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}

export default App;
