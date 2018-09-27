import React, { Component } from 'react';
import Navbar from './components/Navbar';
import ProjectContainer from './components/ProjectContainer';
import logo from './logo.svg';
import './App.css';
import ApolloClient from 'apollo-boost';
//import gql from 'graphql-tag';
import { ApolloProvider } from 'react-apollo';

const apollo = new ApolloClient({
  uri: 'http://localhost:8080/v1alpha1/graphql',
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={apollo}>
        <Navbar></Navbar>
        <ProjectContainer></ProjectContainer>
      </ApolloProvider>
    );
  }
}

export default App;
