import React from 'react'
import Link from 'gatsby-link'

const Header = ({ siteTitle }) => (
  <div
    style={{
      marginBottom: '1.5rem',
      borderBottom: '2px solid black'
    }}
  >
    <div
      style={{
        margin: '0 auto',
        padding: '0.5rem 1rem',
        display: `flex`,
        flexDirection: `row`,
        justifyContent: `space-between`
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: 'gray',
            fontSize: `18px`,
            textDecoration: 'none',
          }}
        >
          {siteTitle}
        </Link>
      </h1>
      <h1 style={{ margin: 0 }}>
        <Link
          to="/about/"
          style={{
            color: 'black',
            fontSize: `18px`,
            textDecoration: 'none',
          }}
        >
          About
        </Link>
      </h1>
    </div>
  </div>
)

export default Header
