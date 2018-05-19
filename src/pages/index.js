import React from 'react'
import Link from 'gatsby-link'

const IndexPage = () => (
  <div style={{ color: `blue` }}>
    <div>
      <Link to="/page-2/">Link</Link>
    </div>
    <div>
      <Link to="/counter/">Counter</Link>
    </div>
  </div>
)

export default IndexPage
