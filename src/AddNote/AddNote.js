import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import './AddNote.css';
import AppContext from '../AppContext';
import ValidationError from '../ValidationError/ValidationError';
import NotefulApi from '../NotefulService';

export default class AddNote extends Component {
  static contextType = AppContext;

  state = {
    name: '', nameValid: false,
    content: '', contentValid: false,
    folder_id: this.setFolderId(), folderIdValid: this.setFolderId() ? true : false,
    error: null,
    validateMsg: {},
    validForm: false
  }

  setFolderId(){
    if (this.props.location.search !== '') {
      return this.props.location.search.split('=')[1]
    } 
    return ''
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const {name, content, folder_id} = this.state
    const note = {name, content, folder_id, modified: new Date()}
    
    try {
      const newNote = await new NotefulApi().addNote(note);
      this.setState({error: null});
      this.props.history.goBack();
      this.context.addNote(newNote);
    } catch(err) {
      this.setState({error: err.message})
    }
  }

  validateForm = () => {
    const {nameValid, contentValid, folderIdValid} = this.state;
    this.setState({
      validForm: nameValid && contentValid && folderIdValid
    })
  }

  updateName = (name) => {
    this.setState({name}, this.validateName(name))
  }

  validateName = (name) => {
    let nameValid = true;
    let validateMsg = {...this.state.validateMsg};

    if (name === '') {
      nameValid = false;
      validateMsg.name = 'Name cannot be blank';
    }
    this.setState({nameValid, validateMsg}, this.validateForm)
  }

  updateContent = (content) => {
    this.setState({content}, this.validateContent(content)) 
  }

  validateContent = (content) => {
    let contentValid = true;
    let validateMsg = {...this.state.validateMsg}

    if (content.length === 0) {
      contentValid = false;
      validateMsg.content = 'Content cannot be blank';
    } else if (content.length <= 5) {
      contentValid = false;
      validateMsg.content = 'Content must be at least 5 characters';
    }

    this.setState({contentValid, validateMsg}, this.validateForm)
  }

  updateFolderId = (folder_id) => {
    this.setState({folder_id}, this.validateFolderId(folder_id))
  }

  validateFolderId = (folder_id) => {
    let folderIdValid = true;
    let validateMsg = {...this.state.validateMsg};
    const {folders} = this.context

    const folder = folders.find(folder => folder.id === Number(folder_id))
    if (!folder) {
      folderIdValid = false;
      validateMsg.folderId = 'Must choose a folder from the dropdown list';
    }

    this.setState({folderIdValid, validateMsg}, this.validateForm)
  }


  render() {
    const { folders } = this.context
    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <div className='error-message'>{this.state.error}</div>
        <NotefulForm onSubmit={(e) => {this.handleSubmit(e)}}>
          <div className='field'>
            <label htmlFor='note-name-input'>
              Name
              < ValidationError isValid={this.state.nameValid} message={this.state.validateMsg.name}/>
            </label>
            <input type='text' id='note-name-input'
              value={this.state.name} 
              onChange={(e) => this.updateName(e.target.value)}/>
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>
              Content
              < ValidationError isValid={this.state.contentValid} message={this.state.validateMsg.content}/>
            </label>
            <textarea id='note-content-input' value={this.state.content} onChange={(e) => this.updateContent(e.target.value)}/>
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder
              < ValidationError isValid={this.state.folderIdValid} message={this.state.validateMsg.folderId}/>
            </label>
            <select id='note-folder-select' value={this.state.folder_id} onChange={(e) => this.updateFolderId(e.target.value)}>
              <option value={null}>...</option>
              {folders.map(folder =>
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              )}
            </select>
          </div>
          <div className='buttons'>
            <button type='submit' disabled={!this.state.validForm}>
              Add note
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}
