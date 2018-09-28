import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import Project from './Project';
import gql from 'graphql-tag';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const PROJECT_QUERY = gql`
query UserById{
  user_by_pk(id: 1) {
    first_name
    owned_projects {
      id
      title
      description
    }
  }
}
`
const CREATE_PROJECT_QUERY = gql`
mutation InsertProject($user_id: Int!, $title: String!, $description: String!, $status: String!){
  insert_project(objects: [{ user_id: $user_id, title: $title, description: $description, status: $status }]){
    returning {
      id
      title
      description
    }
  }
}
`

export default class ProjectContainer extends Component {
  constructor() {
    super();

    this.state = {
      isCreatingProject: false,
      modalProjectTitle: '',
      modalProjectDescription: '',
    };

    this.openCreateProject = this.openCreateProject.bind(this);
    this.closeCreateProject = this.closeCreateProject.bind(this);
    this.setTitle = this.setTitle.bind(this);
    this.setDescription = this.setDescription.bind(this);
  }

  openCreateProject() {
    this.setState({isCreatingProject: true});
  }

  closeCreateProject() {
    this.setState({isCreatingProject: false, modalProjectTitle: '', modalProjectDescription: ''});
  }

  setTitle(event) {
    this.setState({ modalProjectTitle: event.target.value });
  }

  setDescription(event) {
    this.setState({ modalProjectDescription: event.target.value });
  }

  projectRemoved(cache, data) {
    const { user_by_pk } = cache.readQuery({ query: PROJECT_QUERY });
    const projectId = data.data.delete_project.returning[0].id;

    user_by_pk.owned_projects = user_by_pk.owned_projects.filter(p => p.id !== projectId);

    cache.writeQuery({
      query: PROJECT_QUERY,
      data: { user_by_pk }
    });
  }

  render() {
    return (
      <div>
        <button onClick={this.openCreateProject}>New Project</button>

        <Modal
        isOpen={this.state.isCreatingProject}
        contentLabel="Create Project"
        >

          <div>
            Title
            <input placeholder="Title" value={this.state.modalProjectTitle} onChange={this.setTitle}></input>
          </div>

          <div>
            Description
            <textarea placeholder="Description" value={this.state.modalProjectDescription} onChange={this.setDescription}></textarea>
          </div>

          <button onClick={this.closeCreateProject}>Close</button>
          <Mutation 
           mutation={CREATE_PROJECT_QUERY}
           update={(cache, { data: { insert_project } }) => {
             const { user_by_pk } = cache.readQuery({ query: PROJECT_QUERY });
             user_by_pk.owned_projects = user_by_pk.owned_projects.concat(insert_project.returning);
             cache.writeQuery({
                query: PROJECT_QUERY,
                data: { user_by_pk }
             });
           }}
          >
            {(addProject, { data }) => (
              <button onClick={ e => {
                addProject({ variables: { user_id: 1, title: this.state.modalProjectTitle, description: this.state.modalProjectDescription, status: 'created' } });
                this.closeCreateProject();
              }}
              >Save</button>
            )}
          </Mutation>
        </Modal>

        <Query query = {PROJECT_QUERY}>
        {({ loading, data }) => {
          if(loading) return 'Loading...';

          return ( 
            <div>
            {data.user_by_pk.owned_projects.map(p => {
              return <Project 
                key={p.id}
                deleted={this.projectRemoved}
                project={p}
                >
                </Project>
            })}
            </div>
          )
        }}
        </Query>
      </div>
    )
  }
}
