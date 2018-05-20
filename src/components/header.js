import React from 'react'
import Link from 'gatsby-link'
import logo from '../assets/apple-icon.png'

const Header = ({ siteTitle }) => (
  <div
    style={{
      marginBottom: '2.5rem',
      borderBottom: '8px solid #fec92e',
      backgroundColor: 'white'
    }}
  >
    <div
      style={{
        margin: '0 auto',
        padding: '0.7rem 1rem',
        display: `flex`,
        flexDirection: `row`,
        justifyContent: `space-between`
      }}
    >
      <Link to="/" style={{display: 'flex', alignItems: 'center', flexDirection: 'row', textDecoration: 'none'}}>
        <img style={{width: '35px', height: '35px', margin: '0 auto'}} src={logo} alt="logo" />
        <h1 style={{margin: '0 auto' , color: 'black', fontSize: `22px`, textDecoration: 'none', paddingLeft: '5px'}}>{siteTitle}</h1>
      </Link>
    </div>
  </div>
)

export default Header
