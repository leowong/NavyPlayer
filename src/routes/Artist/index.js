import React, { Component } from 'react'
import { connect } from 'react-redux'
import Login from 'components/Login'
import Nav from 'components/Nav'
import Player from 'components/Player'
import Footer from 'components/Footer'
import ArtistInfo from 'components/Artist'
import Songs from 'components/Songs'
import ArtistPlaylists from 'components/ArtistPlaylist'
import Similar from 'components/Similar'
import Albums from 'components/Albums'
import './artist.scss'

class Artist extends Component {
  constructor() {
    super()
    this.state = {
      artist: '',
      artistImage: '',
      artistGeneres: [],
      artistBio: ''
    }
  }

  fetchArtistInfo = artist => {
    fetch(
      `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artist}&api_key=65d425fd474110ff88a87831da65d6da&format=json`
    )
      .then(resp => resp.json())
      .then(({ artist: { image, tags, bio } }) =>
        this.setState({
          artist,
          artistImage: image.find(e => e.size === 'mega')['#text'],
          artistGeneres: tags.tag.map(e => e.name),
          artistBio: (bio.summary || bio.content).replace(/<a.*?<\/a>/, '')
        })
      )
  }

  componentDidMount() {
    this.fetchArtistInfo(this.props.artist)
  }

  componentDidUpdate() {
    const { artist } = this.props
    if (artist !== this.state.artist || !artist) {
      this.fetchArtistInfo(artist)
    }
  }

  render() {
    const { artistImage: artist } = this.state
    return (
      <div
        className="artist background background__artist"
        style={{
          backgroundImage: `linear-gradient(to left,rgba(0,0,0,0) 5%, #000a11 92%), url(${artist &&
            artist.replace(/(300)x\1/, '1000x1000')})`
        }}
      >
        <header>
          <Nav />
          <Login />
        </header>
        <main>
          <ArtistInfo data={this.state} />
          <Songs />
          <ArtistPlaylists />
          <Similar />
          <Albums />
        </main>
        <Player />
        <Footer />
      </div>
    )
  }
}

const mapStateToProps = ({
  track: {
    artist: { name }
  }
}) => ({ artist: name })

export default connect(mapStateToProps)(Artist)
