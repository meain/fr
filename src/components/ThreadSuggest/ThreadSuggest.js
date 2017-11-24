import React, { Component } from 'react'
import Autosuggest from 'react-autosuggest'

import './ThreadSuggest.css'


class ThreadSuggest extends React.Component {
  constructor() {
    super()

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '',
      suggestions: []
    }

    this.getSuggestions = this.getSuggestions.bind(this)
    this.renderSuggestion = this.renderSuggestion.bind(this)
  }

getSuggestions = value => {
  const inputValue = value.trim().toLowerCase()
  const inputLength = inputValue.length
  console.table(this.props.threads)
  return inputLength === 0 ? [] : this.props.threads.filter(thread =>
    thread.data.title.toLowerCase().slice(0, inputLength) === inputValue
  )
}

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
getSuggestionValue = suggestion => suggestion.data.title

// Use your imagination to render suggestions.
renderSuggestion = suggestion => (
  <div>
    {suggestion.data.title}
  </div>
)

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    })
    this.props.onChange(newValue)
  }

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    })
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    })
  }

  render() {
    const { value, suggestions } = this.state
    const languages = this.props.threads

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Search questions',
      value,
      onChange: this.onChange
    }

    // Finally, render it!
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

export default ThreadSuggest