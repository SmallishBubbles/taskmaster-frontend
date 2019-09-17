import React, {useState, useEffect} from 'react';
import { useInput } from './useInput.js';
import './reset.css';
import './App.css';

let form = new FormData();

const API = "http://taskmaster-backend.us-west-2.elasticbeanstalk.com/api/v1"

function App() {

  const [tasks, setTasks] = useState([]);

  function _getTasks() {
    console.log("get tasks")
    fetch(API + "/tasks")
      .then( data => data.json() )
      .then( fetchedTasks => setTasks(fetchedTasks) );
  }

  function _getThumbnailUrl(url) {
    if ( url !== null ) {
      let originalUrl = url;
      let imageName = originalUrl.match(/[^/]+$/);
      let newImageName = "resized-" + imageName;
      let newUrl = "https://taskmaster-frontend-marisha-images-resized.s3-us-west-2.amazonaws.com/" + newImageName;
      return newUrl;
    }
    return null;
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
                <div className="task">
                  <img src={task.imgUrl}></img>
                  <img src={_getThumbnailUrl(task.imgUrl)}></img>
                  <details>
                    <summary className="flex summary-container">
                      <div className="summary">
                        <h2>{task.title}</h2>
                        <p>{task.description}</p>
                        <AddPic id={task.id} reload={_getTasks}></AddPic>
                      </div>
                    </summary>
                    <History history={task.history} />
                  </details>
                </div>
              </li>
            )
          })}
        </ul>
        <div className="form-container">
          <h3> Create a new task: </h3>
          <TaskForm reload={_getTasks}></TaskForm>
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
        .then( () => props.reload() )
        .then( fetchedTasks => console.log(fetchedTasks) );

      resetTitle();
      resetDescription();


      // I know this is very bad react. Need to figure out how to change state of app instead.
      // window.location.reload(false);
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


function AddPic(props) {
  function _handleChange(event) {
    let value = event.target.files ? event.target.files[0] : event.target.value;
    form.set(event.target.name, value);
  }

  function _upload(event) {
    event.preventDefault();
    fetch(API + `/tasks/${props.id}/images` , {
      method: "POST",
      mode: "no-cors",
      body: form,
    })
    .then(response => response.json())
    .catch(error => console.error('Error:', error))
    .then( () => props.reload() );

  }

  return (
    <form onSubmit={_upload} action={API + `/tasks/${props.id}/images`} method="POST" encType={"multipart/form-data"}>
      <label>
        <span>Upload Image </span>
        <input onChange={_handleChange} name="file" type="file" />
      </label>
      <button>Save</button>
    </form>
  );
}

export default App;
