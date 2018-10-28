import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';

import './layout.css';

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            {
              name: 'description',
              content: 'A small web-app to make finding anagrams easier',
            },
            { name: 'keywords', content: 'anagram' },
          ]}
        >
          <html lang="en" />
        </Helmet>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '15px',
            height: '100%',
          }}
        >
          {children}
        </div>
      </>
    )}
  />
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
