import Link from "gatsby-link";
import React from 'react';
// Syntax highlighting
import styles from "./index-css-modules.module.css";

require("prismjs/themes/prism-okaidia.css");


export default ({ data }) => {
  console.log(data);
  return (
    <div className={styles.postContainer}>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <div className={styles.post} key={node.id}>
        <Link to={node.fields.slug} style={{ textDecoration: `none`, color: `inherit` }} >
            <span>{node.frontmatter.date}</span>
            <h3>{node.frontmatter.title}{" "}</h3>
            
            <p>{node.excerpt}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export const query = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "MMMM D")
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
  }
`;