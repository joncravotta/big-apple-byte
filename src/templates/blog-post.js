import React from "react";
import styles from "./blog-post-css-modules.module.css";


export default ({ data }) => {
  const post = data.markdownRemark;
  return (
    <div style={{
      margin: '0 auto',
      maxWidth: 900,
      padding: `0, 20`
    }}>
      <h1 className={styles.header}>{post.frontmatter.title}</h1>
      <div className={styles.post} dangerouslySetInnerHTML={{ __html: post.html }} />
    </div>
  );
};

export const query = graphql`
  query BlogPostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`;

