import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';
import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';


// App component - represents the whole app
class App extends Component {

  handleSubmit(event) {
  event.preventDefault();

  // Find the text field via the React ref
  const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

  Tasks.insert({
    text,
    createdAt: new Date(), // current time
    owner: Meteor.userId(),           // _id of logged in user
    username: Meteor.user().username,  // username of logged in user
  });

  // Clear form
  ReactDOM.findDOMNode(this.refs.textInput).value = '';
}


  renderTasks() {
    return this.props.tasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }

  render() {
    return (
        <div className="container">
          <div className='row col-md-7'>

          <div className="panel panel-primary">

          <div className="panel-heading"><h4 className="text-center white">Todo List</h4></div>

          <div className="panel-content">
            <br />

            <AccountsUIWrapper />

          <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
            <div className="form-group">
            <input
              type="text"
              ref="textInput"
              className="form-control text-center"
              placeholder="Add new Task"
            />
          </div>
        </form><br />


        <ul>
          {this.renderTasks()}
        </ul>
        <br />

      </div>
      </div>
      </div>
      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
     tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
     incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
     currentUser: Meteor.user(),
  };
}, App);
