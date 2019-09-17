# Taskmaster

This application allows a user to view tasks and their history.

## Preview
![app homepage](./app-preview.png)

### Deployed Endpoint: 
##### [S3 - taskmaster-frontend-marisha](http://taskmaster-frontend-marisha.s3-website-us-west-2.amazonaws.com/)

### Backend API Repository: 
##### [Taskmaster-401/taskmaster/marisha/update](https://github.com/Taskmaster-401/taskmaster/pull/2)
##### [Endpoint](http://taskmaster-backend.us-west-2.elasticbeanstalk.com/api/v1/tasks)


### Lambda
  Our lambda function is automatically invoked when a new image is uploaded to the images s3 bucket. 

  Our main issue with this function was the `runtime` environment. Our function was automatically created with node 10, but the function needs `Node.js 8.10` to work correctly.
  
  
### Collaborators
- Peter Lee
