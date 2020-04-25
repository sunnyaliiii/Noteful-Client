import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import Error from '../Error'
import PropTypes from 'prop-types'
import './AddFolder.css'
import ApiContext from '../ApiContext'
require('dotenv').config()


export default class AddFolder extends Component {
  static contextType = ApiContext;

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      nameValid: false,
      validationMessage: ''
    }
  }

  handleNameChange = name => {
    this.setState({
      name
    })
  }

  handleFormSubmit = e => {
    e.preventDefault();
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 5ea97ca2-02d9-4c1e-9089-8c26f957fdb8`
      }, 
      body: JSON.stringify({name: this.state.name})
    }
    fetch('http://localhost:8000/api/folders/', options)
      .then(res => {
        if(!res.ok) {
          throw new Error('Something went wrong. Please refresh the page.')
        }
        return res;
      })
      .then(data => data.json())
      .then(results => {
        const newFolder = {
          name: results.name,
          id: results.id
        }
        this.context.handleFolderAdd(newFolder)
      })
      .then(this.props.history.goBack())
      .catch(err => console.error(err))
  }

  render() {
    return (
      <Error>
        <section className='AddFolder'>
          <h2>Create a folder</h2>
          <NotefulForm onSubmit={this.handleFormSubmit}>
            <div className='field'>
              <label htmlFor='folder-name-input'>
                Name
              </label>
              <input 
                type='text' 
                id='folder-name-input'
                onChange={e => this.handleNameChange(e.target.value)} />
            </div>
            <div className='buttons'>
              <button type='submit'>
                Add folder
              </button>
            </div>
          </NotefulForm>
        </section>
      </Error>
    )
  }
}

AddFolder.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func
  })
}
