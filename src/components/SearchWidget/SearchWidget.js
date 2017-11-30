import React, { Component } from 'react'
import Icon from 'react-fa'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

import fuzzysearch from 'fuzzysearch'

import './SearchWidget.css'

class SearchWidget extends Component {
  constructor(props) {
    super(props)

    this.state = {
      displayObjects: this.props.objects,
      searching: false
    }

    this.filterObjects = this.filterObjects.bind(this)
  }

  filterObjects() {
    let query = this.searchInput.value
    let objects = this.props.objects
    objects = objects.filter(object =>
      fuzzysearch(query.toLowerCase(), object.data.title.toLowerCase())
    )
    console.log('query: ', query, query.length)

    if (query.length > 0) {
      this.setState({
        ...this.state,
        searching: true,
        displayObjects: objects
      })
    } else {
      this.setState({
        ...this.state,
        searching: false,
      })
    }
  }

  objectDisplay(object, index) {
    let alternate = index % 2 === 0 ? '' : 'alternate'
    let ObjectItem = withRouter(({ history }) => {
      return (
        <div
          className={'SearchWidget-searchItem ' + alternate}
          onClick={() => {
            history.push('/thread/' + object.id)
          }}
        >
          {object.data.title}
        </div>
      )
    })
    return <ObjectItem key={object.id} />
  }

  render() {
    let objects = this.state.displayObjects
    let listHide = this.state.searching ? 'unhide' : ''
    console.log('objects: ', this.state.searching, listHide, objects)
    return (
      <div className="SearchWidget">
        <input
          ref={ref => (this.searchInput = ref)}
          type="text"
          className="SearchWidget-input"
          placeholder="Search"
          onChange={this.filterObjects}
        />
        <button className="SearchWidget-button">
          <Icon name="search" />
        </button>
        <div className={'SearchWidget-searchList ' + listHide}>
          <div className="SearchWidget-searches">
            {objects.map((object, index) => this.objectDisplay(object, index))}
            {objects.length === 0 && (
              <div className="SearchWidget-none">
                <span class="muted">No results</span>
              </div>
            )}
          </div>
          <div class="SearchWidget-extra">
            <Link to="/">More results</Link>
            <Link to="/newPost">Ask Question</Link>
          </div>
        </div>
      </div>
    )
  }
}

export default SearchWidget
