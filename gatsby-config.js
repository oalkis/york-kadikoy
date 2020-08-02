module.exports = {
  siteMetadata: {
    title: "York Kadıköy",
    description: "York Kadıköy Bar",
  },
  plugins: [
    {
      resolve: `gatsby-plugin-styled-jsx`,
    },
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sass",
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true, // defaults to false
        //jsxPragma: `jsx`, // defaults to "React" ??
        allExtensions: true,
      },
    },
    // {
    //   resolve: "gatsby-theme-photo-albums",
    //   options: {
    //     baseUrl: "/gallery", // the path to the photo albums from your site (default: '/')
    //     photosPerPage: 15, // the number of photos to display on a page (default: 15)
    //     path: `${__dirname}/static/img/gallery`,
    //     name: "gallery",
    //   },
    // },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/static/img/gallery`,
        name: "gallery",
      },
    },
    {
      // keep as first gatsby-source-filesystem plugin for gatsby image support
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/static/img`,
        name: "uploads",
      },
    },

    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/src/pages`,
        name: "pages",
      },
    },
    // {
    //   resolve: "gatsby-source-filesystem",
    //   options: {
    //     path: `${__dirname}/src/img`,
    //     name: "images",
    //   },
    // },

    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-relative-images",
            options: {
              name: "uploads",
            },
          },
          {
            resolve: "gatsby-remark-images",
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 2048,
            },
          },
          {
            resolve: "gatsby-remark-copy-linked-files",
            options: {
              destinationDir: "static",
            },
          },
        ],
      },
    },
    {
      resolve: "gatsby-plugin-netlify-cms",
      options: {
        modulePath: `${__dirname}/src/cms/cms.js`,
      },
    },
    {
      resolve: "gatsby-plugin-purgecss", // purges all unused/unreferenced css rules
      options: {
        develop: true, // Activates purging in npm run develop
        purgeOnly: ["/all.sass"], // applies purging only on the bulma css file
      },
    }, // must be after other CSS plugins
    "gatsby-plugin-netlify", // make sure to keep it last in the array
  ],
};
