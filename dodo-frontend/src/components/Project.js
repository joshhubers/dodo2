import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import './Project.css';

const DELETE_PROJECT_QUERY = gql`
  mutation DeleteProject($project_id: Int!) {
    delete_project(where:{ id: { _eq: $project_id } })
    {
      returning {
        id
      }
    }
  } 
`

class Project extends Component {

  constructor() {
    super();

    this.onDelete = this.onDelete.bind(this);
  }

  onDelete(deleteProject) {
    deleteProject({ variables: { project_id: this.props.project.id }});
  }

  deleted(cache, data) {
    this.props.deleted(cache, data);
  }

  render() {
    const project = this.props.project;
    return (
      <div className='project'>
        <h3 className='project__title'>{project.title}</h3>

        <Mutation
          mutation={DELETE_PROJECT_QUERY}
          update={(cache, data) => this.deleted(cache, data)}>
          {(deleteProject, { data }) => (
            <button onClick={() => this.onDelete(deleteProject)}>X</button>
          )}
        </Mutation>
        <hr></hr>
        {project.description}
      </div>
    );
  }
}

export default Project;
