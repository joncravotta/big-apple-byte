/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

 // You can delete this file if you're not using it

 // This creates the paths for our markdown files
 const path = require(`path`);
 const { createFilePath } = require(`gatsby-source-filesystem`);
 
 exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
   const { createNodeField } = boundActionCreators
   if (node.internal.type === `MarkdownRemark`) {
     const slug = createFilePath({ node, getNode, basePath: `posts` })
     createNodeField({
       node,
       name: `slug`,
       value: slug,
     })
   }
 };
 
 // Here we tell Gatsby about our pages—what are their paths, what template component do they use, etc.
 exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `).then(result => {
      result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        createPage({
          path: node.fields.slug,
          component: path.resolve(`./src/templates/blog-post.js`),
          context: {
            // Data passed to context is available in page queries as GraphQL variables.
            slug: node.fields.slug,
          },
        })
      })
      resolve()
    })
  })
};
