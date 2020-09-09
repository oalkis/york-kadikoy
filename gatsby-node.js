const _ = require("lodash");
const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");
const { fmImagesToRelative } = require("gatsby-remark-relative-images");
const fs = require("fs");

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  return graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              templateKey
            }
          }
        }
      }
      localImages: allFile(
        filter: {
          extension: { regex: "/(jpeg|jpg|png)/" }
          sourceInstanceName: { eq: "gallery" }
        }
        sort: { fields: [absolutePath], order: [ASC] }
      ) {
        edges {
          node {
            absolutePath
            childImageSharp {
              fixed(quality: 90, width: 450, height: 300, cropFocus: NORTH) {
                src
              }
              fluid(
                quality: 90
                maxWidth: 2048
                traceSVG: { color: "#f9ebd2" }
              ) {
                tracedSVG
                aspectRatio
                src
                srcSet
                sizes
                originalImg
              }
            }
          }
        }
      }
      menuPages: allFile(
        filter: {
          extension: { regex: "/(jpeg|jpg|png)/" }
          sourceInstanceName: { eq: "menu" }
        }
        sort: { fields: [absolutePath], order: [ASC] }
      ) {
        edges {
          node {
            absolutePath
            childImageSharp {
              fixed(quality: 90, width: 450, height: 300, cropFocus: NORTH) {
                src
              }
              fluid(
                quality: 90
                maxWidth: 2048
                traceSVG: { color: "#f9ebd2" }
              ) {
                tracedSVG
                aspectRatio
                src
                srcSet
                sizes
                originalImg
              }
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      result.errors.forEach((e) => console.error(e.toString()));
      return Promise.reject(result.errors);
    }

    const posts = result.data.allMarkdownRemark.edges;
    const edges = result.data.localImages.edges;
    const pages = result.data.menuPages.edges;
    const cropHelperEdges = {};
    const cropHelperEdgesForMenu = {};

    const imageEdges = [];
    const pageEdges = [];

    edges.forEach((edge) => {
      const name = parseName(edge.node.absolutePath);
      if (name.endsWith("_crophelper")) cropHelperEdges[name] = edge;
      else imageEdges.push(edge);
    });
    pages.forEach((page) => {
      const name = parseName(page.node.absolutePath);
      if (name.endsWith("_crophelper")) cropHelperEdgesForMenu[name] = page;
      else pageEdges.push(page);
    });
    /* Create metadata JSON for actual images. */
    var nextFreeId = 1;
    var nextFreePageId = 1;

    images = [];
    menu = [];

    imageEdges.forEach((edge) => {
      const name = parseName(edge.node.absolutePath);
      /* Infer photographer attribution from name. */
      const title = name.endsWith("_v")
        ? "Conditional attribution caption"
        : "Photo from Unsplash";

      /* Use thumbnail from crop helper if that's available. */

      const key = name + "_crophelper";
      const thumb = cropHelperEdges[key]
        ? cropHelperEdges[key].node.childImageSharp.fixed
        : edge.node.childImageSharp.fixed;

      images[nextFreeId] = {
        id: nextFreeId,
        fluid: edge.node.childImageSharp.fluid,
        thumb: thumb,
        title: title,
      };
      nextFreeId++;
    });
    pageEdges.forEach((edge) => {
      const name = parseName(edge.node.absolutePath);
      /* Infer photographer attribution from name. */
      const title = name.endsWith("_v")
        ? "Conditional attribution caption"
        : "Photo from Unsplash";

      /* Use thumbnail from crop helper if that's available. */

      const key = name + "_crophelper";
      const thumb = cropHelperEdgesForMenu[key]
        ? cropHelperEdgesForMenu[key].node.childImageSharp.fixed
        : edge.node.childImageSharp.fixed;

      menu[nextFreePageId] = {
        id: nextFreePageId,
        fluid: edge.node.childImageSharp.fluid,
        thumb: thumb,
        title: title,
      };
      console.log("forach", name);
      nextFreePageId++;
    });

    /* Gatsby will use this template to render the paginated pages (including the initial page for infinite scroll). */
    const paginatedGalleryTemplate = path.resolve(
      `src/templates/paginatedGalleryTemplate.js`
    );
    const paginatedGalleryTemplateForMenu = path.resolve(
      `src/templates/paginatedGalleryTemplateForMenu.js`
    );
    /* Create pageContexts for each image. */
    const pageContexts = [];
    for (var currId = 1; currId < nextFreeId; currId++) {
      const prevId = currId == 1 ? nextFreeId - 1 : currId - 1;
      const nextId = currId == nextFreeId - 1 ? 1 : currId + 1;
      const next2Id = nextId == nextFreeId - 1 ? 1 : nextId + 1;
      pageContexts[currId] = {
        image: images[currId],
        nextId: nextId,
        prevId: prevId,
        prefetchNext1: fluidWithoutPlaceholder(
          images[nextId].fluid
        ) /* Drop placeholder to save some bandwidth. */,
        prefetchNext2: fluidWithoutPlaceholder(images[next2Id].fluid),
        prefetchPrev: fluidWithoutPlaceholder(images[prevId].fluid),
      };
    }
    const pageContextsForMenu = [];
    for (var currId = 1; currId < nextFreePageId; currId++) {
      const prevId = currId == 1 ? nextFreePageId - 1 : currId - 1;
      const nextId = currId == nextFreePageId - 1 ? 1 : currId + 1;
      const next2Id = nextId == nextFreePageId - 1 ? 1 : nextId + 1;
      pageContextsForMenu[currId] = {
        image: menu[currId],
        nextId: nextId,
        prevId: prevId,
        prefetchNext1: fluidWithoutPlaceholder(
          menu[nextId].fluid
        ) /* Drop placeholder to save some bandwidth. */,
        prefetchNext2: fluidWithoutPlaceholder(menu[next2Id].fluid),
        prefetchPrev: fluidWithoutPlaceholder(menu[prevId].fluid),
      };
    }
    /* Create pagination for gallery (which is also used by infinite scroll). */
    const countImagesPerPage = 20;
    const countPages = Math.ceil(nextFreeId / countImagesPerPage);
    for (var currentPage = 1; currentPage <= countPages; currentPage++) {
      /* Create paths "/", "/2", "/3", ... */
      const pathSuffix = currentPage > 1 ? +currentPage : "";

      /* Collect metadata for images on this paginated gallery page. */
      const startIndexInclusive = countImagesPerPage * (currentPage - 1) + 1;
      const endIndexExclusive = startIndexInclusive + countImagesPerPage;
      const pageImages = images
        .slice(startIndexInclusive, endIndexExclusive)
        .map((image) => {
          return {
            /* Each image on a paginated gallery page needs id, thumb, and pageContext (to enable instant navigation). */
            id: image.id,
            thumb: image.thumb,
            pageContext: pageContexts[image.id],
          };
        });

      /* Combine all data needed to construct this page. */
      const pageData = {
        path: `/gallery/${pathSuffix}`,
        component: paginatedGalleryTemplate,
        context: {
          pageImages: pageImages,
          currentPage: currentPage,
          countPages: countPages,
        },
      };

      /* Create normal pages (for pagination) and corresponding JSON (for infinite scroll). */
      createJSON(pageData);
      createPage(pageData);
    }
    const countMenuPages = Math.ceil(nextFreePageId / countImagesPerPage);
    console.log("count", countMenuPages);
    for (var currentPage = 1; currentPage <= countMenuPages; currentPage++) {
      /* Create paths "/", "/2", "/3", ... */
      const pathSuffix = currentPage > 1 ? +currentPage : "";

      /* Collect metadata for images on this paginated gallery page. */
      const startIndexInclusive = countImagesPerPage * (currentPage - 1) + 1;
      const endIndexExclusive = startIndexInclusive + countImagesPerPage;
      const pageImages = menu
        .slice(startIndexInclusive, endIndexExclusive)
        .map((image) => {
          return {
            /* Each image on a paginated gallery page needs id, thumb, and pageContext (to enable instant navigation). */
            id: image.id,
            thumb: image.thumb,
            pageContext: pageContextsForMenu[image.id],
          };
        });

      /* Combine all data needed to construct this page. */
      const pageData = {
        path: `/menu/${pathSuffix}`,
        component: paginatedGalleryTemplateForMenu,
        context: {
          pageImages: pageImages,
          currentPage: currentPage,
          countPages: countMenuPages,
        },
      };

      /* Create normal pages (for pagination) and corresponding JSON (for infinite scroll). */
      createJSONForMenu(pageData);
      createPage(pageData);
    }
    console.log(`\nCreated ${countPages} pages of paginated content.`);

    /* Create pages for images, too. */
    for (var currId = 1; currId < nextFreeId; currId++) {
      const pageData = {
        path: `/gallery/images/${currId}`,
        component: path.resolve(`src/templates/postcardTemplate.js`),
        context: pageContexts[currId],
      };
      createPage(pageData);
    }
    for (var currId = 1; currId < nextFreePageId; currId++) {
      const pageData = {
        path: `/menu/images/${currId}`,
        component: path.resolve(`src/templates/postcardTemplateForMenu.js`),
        context: pageContextsForMenu[currId],
      };
      createPage(pageData);
    }

    /* Create a special dummy page needed for instant navigation from Gallery to image (explained in README). */
    createPage({
      path: `/gallery/images/fromGallery`,
      component: path.resolve(`src/templates/postcardTemplate.js`),
      context: dummyContext(),
    });
    createPage({
      path: `/menu/images/fromGallery`,
      component: path.resolve(`src/templates/postcardTemplateForMenu.js`),
      context: dummyContext(),
    });
    edges.forEach((edge) => {
      const name = parseName(edge.node.absolutePath);
      if (name.endsWith("_crophelper")) cropHelperEdges[name] = edge;
      else imageEdges.push(edge);
    });
    pages.forEach((edge) => {
      const name = parseName(edge.node.absolutePath);
      if (name.endsWith("_crophelper")) cropHelperEdgesForMenu[name] = edge;
      else pageEdges.push(edge);
    });
    posts.forEach((edge) => {
      const id = edge.node.id;
      createPage({
        path: edge.node.fields.slug,
        tags: edge.node.frontmatter.tags,
        component: path.resolve(
          `src/templates/${String(edge.node.frontmatter.templateKey)}.js`
        ),
        // additional data can be passed via context
        context: {
          id,
        },
      });
    });
  });
};
function createJSON(pageData) {
  const pathSuffix = pageData.path.substring(9);
  const dir = "public/paginationJson/";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const filePath = dir + "gallery" + pathSuffix + ".json";
  const dataToSave = JSON.stringify(pageData.context.pageImages);
  fs.writeFile(filePath, dataToSave, function (err) {
    if (err) {
      return console.log(err);
    }
  });
}
function createJSONForMenu(pageData) {
  const pathSuffix = pageData.path.substring(9);
  const dir = "public/paginationJsonForMenu/";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const filePath = dir + "menu" + pathSuffix + ".json";
  const dataToSave = JSON.stringify(pageData.context.pageImages);
  fs.writeFile(filePath, dataToSave, function (err) {
    if (err) {
      return console.log(err);
    }
  });
}
function parseName(absolutePath) {
  const splitted = absolutePath.split(".");
  return splitted[splitted.length - 2];
}

function fluidWithoutPlaceholder(fluid) {
  return {
    aspectRatio: fluid.aspectRatio,
    src: fluid.src,
    srcSet: fluid.srcSet,
    sizes: fluid.sizes,
    originalImg: fluid.originalImg,
  };
}

function dummyContext() {
  const dummyFluid = {
    srcSet: "",
    src: "",
    aspectRatio: 1.0,
    sizes: "",
    originalImg: "",
    tracedSVG: "",
  };
  const dummyImage = {
    id: 1,
    fluid: dummyFluid,
    fluidWithoutPlaceholder: dummyFluid,
    thumb: {},
    title: "",
  };
  return {
    image: dummyImage,
    nextId: 1,
    prevId: 1,
    prefetchNext1: dummyFluid,
    prefetchNext2: dummyFluid,
    prefetchPrev: dummyFluid,
  };
}
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;
  fmImagesToRelative(node); // convert image paths for gatsby images

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};
