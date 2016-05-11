import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';

import provide from 'react-redux-provide';
import selectn from 'selectn';

import classNames from 'classnames';

import {Link} from 'provide-page';

import Navigation from 'views/components/Navigation';

import { PageHome, PageExploreDialects, PageExploreArchive, PageExploreFamily, PageExploreLanguage, PageExploreDialect } from 'views/pages';

import { PageDialectLearn, PageDialectPlay, PageDialectGallery, PageDialectReports } from 'views/pages';
import { PageDialectLearnWords, PageDialectLearnPhrases, PageDialectLearnStoriesAndSongs, PageDialectViewDictionaryItem } from 'views/pages';
import { PageDialectViewWord, PageDialectViewPhrase, PageDialectViewBook } from 'views/pages';

import { PageGetStarted, PageContribute, PagePlay, PageSearch } from 'views/pages';

import { PageExploreDialectEdit, PageDialectWordEdit } from 'views/pages/edit';
import {
  PageDialectWordsCreate, PageDialectPhrasesCreate, PageDialectStoriesAndSongsCreate,
  PageDialectGalleryCreate, PageDialectCategoryCreate, PageDialectPhraseBooksCreate,
  PageDialectContributorsCreate, PageDialectStoriesAndSongsBookEntryCreate } from 'views/pages/create';

// To be used later views below:

// Pages
/*import Index from 'views/pages/index';
import GetStarted from 'views/pages/get-started';

// Pages: Explore
import ExploreArchive from 'views/pages/explore/archive';
import ExploreFamily from 'views/pages/explore/family';
import ExploreLanguage from 'views/pages/explore/language';

// Pages: Dialect Portal
import ExploreDialect from 'views/pages/explore/dialect';

import DialectLearnWords from 'views/pages/explore/dialect/learn/words';
import DialectLearnPhrases from 'views/pages/explore/dialect/learn/phrases';
import DialectLearnSongs from 'views/pages/explore/dialect/learn/songs';
import DialectLearnStories from 'views/pages/explore/dialect/learn/stories';
import DialectPlay from 'views/pages/explore/dialect/play';
import DialectCommunitySlideshow from 'views/pages/explore/dialect/community-slideshow';
import DialectArtGallery from 'views/pages/explore/dialect/art-gallery';

// Pages: Dialect -> Word
import ViewWord from 'views/pages/explore/dialect/learn/words/view';

import Contribute from 'views/pages/contribute';
import Play from 'views/pages/play';
import NotFound from 'views/pages/not-found';*/

// Regex helper
const ANYTHING_BUT_SLASH = new RegExp("([^/]*)");
const WORKSPACE_OR_SECTION = new RegExp("(sections|Workspaces)");

const REMOVE_FROM_BREADCRUMBS = ['FV', 'sections', 'Data', 'Workspaces', 'edit', 'search'];

const WORKSPACE_TO_SECTION_REDIRECT = {
  condition: function(params) { return (selectn("isConnected", params.props.computeLogin) === false && params.props.splitWindowPath[2] == 'Workspaces') },
  target: function(params) { return '/' + params.props.splitWindowPath.join('/').replace('Workspaces', 'sections'); }
};

@provide
export default class AppFrontController extends Component {
  static propTypes = {
    properties: PropTypes.object.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    windowPath: PropTypes.string.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    replaceWindowPath: PropTypes.func.isRequired,
    computeLogin: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = this._getInitialState();

    // Bind methods to 'this'
    ['_matchPath', '_route'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  _getInitialState() {

    const routes = Immutable.fromJS([
      {
        path: [],
        page: <PageHome />
      },
      {
        path: ['get-started'],
        page: <PageGetStarted />
      },
      {
        path: ['contribute'],
        page: <PageContribute />
      },
      {
        path: ['play'],
        page: <PagePlay />
      },
      {
        path: ['explore'],
        page: <PageExploreArchive />,
        redirects: [{
          condition: function(params) { return true; },
          target: function(params) { return '/explore/FV/sections/Data/'; }
        }]
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data'],
        page: <PageExploreDialects />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', 'search', ANYTHING_BUT_SLASH],
        page: <PageSearch />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'search'],
        page: <PageSearch />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'search', ANYTHING_BUT_SLASH],
        page: <PageSearch />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', new paramMatch('language_family', ANYTHING_BUT_SLASH)],
        page: <PageExploreFamily />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH ],
        page: <PageExploreLanguage />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH ],
        page: <PageExploreDialect />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: ['explore', 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'edit' ],
        page: <PageExploreDialectEdit />
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn' ],
        page: <PageDialectLearn />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'play' ],
        page: <PageDialectPlay />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: ['explore', 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'gallery', 'create' ],
        page: <PageDialectGalleryCreate />
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'gallery', ANYTHING_BUT_SLASH ],
        page: <PageDialectGallery />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'reports' ],
        page: <PageDialectReports />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'words' ],
        page: <PageDialectLearnWords />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: ['explore', 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'words', 'create' ],
        page: <PageDialectWordsCreate />,
        extractPaths: true
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'words', ANYTHING_BUT_SLASH ],
        page: <PageDialectViewWord />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: ['explore', 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'words', 'edit', ANYTHING_BUT_SLASH ],
        page: <PageDialectWordEdit />
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'phrases' ],
        page: <PageDialectLearnPhrases />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: ['explore', 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'phrases', 'create' ],
        page: <PageDialectPhrasesCreate />
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'phrases', ANYTHING_BUT_SLASH ],
        page: <PageDialectViewPhrase />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'stories' ],
        page: <PageDialectLearnStoriesAndSongs typeFilter="story" />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'songs' ],
        page: <PageDialectLearnStoriesAndSongs typeFilter="song" />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: ['explore', 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'stories', 'create' ],
        page: <PageDialectStoriesAndSongsCreate typeFilter="story" />
      },
      {
        path: ['explore', 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'songs', 'create' ],
        page: <PageDialectStoriesAndSongsCreate typeFilter="song" />
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'songs', new paramMatch('bookName', ANYTHING_BUT_SLASH) ],
        page: <PageDialectViewBook typeFilter="song" />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'songs', new paramMatch('parentBookName', ANYTHING_BUT_SLASH), 'create' ],
        page: <PageDialectStoriesAndSongsBookEntryCreate typeFilter="song" />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'stories', new paramMatch('bookName', ANYTHING_BUT_SLASH) ],
        page: <PageDialectViewBook typeFilter="story" />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'stories', new paramMatch('parentBookName', ANYTHING_BUT_SLASH), 'create' ],
        page: <PageDialectStoriesAndSongsBookEntryCreate typeFilter="story" />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: ['explore', 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'categories', 'create' ],
        page: <PageDialectCategoryCreate />,
        extractPaths: true
      },
      {
        path: ['explore', 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'phrasebooks', 'create' ],
        page: <PageDialectPhraseBooksCreate />
      }
    ]);

    return {
      routes: routes,
      matchedPage: null,
      matchedRouteParams: []
    };
  }

  /**
  * Conditionally route the parameters.
  * This could normally go into the render method to keep things simple,
  * however redirecting (i.e. updating state), cannot be done inside render.
  */
  _route(props) {

    let matchedPage = null
    let matchedRouteParams = [];

    const pathArray = props.splitWindowPath;

    this.state.routes.forEach(function(value, key) {

      let matchTest = this._matchPath(value.get('path'), pathArray);

      if (matchTest.matched) {

        let routeParams = matchTest.routeParams;

        // Extract common paths from URL
        if (value.has('extractPaths') && value.get('extractPaths')) {
          if (pathArray.length >= 7)
            routeParams['dialect_path'] = decodeURI('/' + pathArray.slice(1, 7).join('/'));

          if (pathArray.length >= 6)
            routeParams['language_path'] = decodeURI('/' + pathArray.slice(1, 6).join('/'));

          if (pathArray.length >= 5)
            routeParams['language_family_path'] = decodeURI('/' + pathArray.slice(1, 5).join('/'));
        }

        matchedPage = value;
        matchedRouteParams = routeParams;

        // Break out of forEach
        return false;
      }
    }.bind(this));

    // Match found
    if (matchedPage !== null) {

      // Redirect if required
      if (matchedPage.has('redirects')) {
        matchedPage.get('redirects').forEach(function(value, key) {

          if (value.get('condition')({props: props})) {
            props.replaceWindowPath(value.get('target')({props: props}));
            return false;
          }
        }.bind(this));
      }

      this.setState({
        matchedPage: matchedPage,
        matchedRouteParams: matchedRouteParams
      });
    }
  }

  componentWillMount() {
    this._route(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.windowPath != this.props.windowPath) {
      this._route(nextProps);
    }
  }

  _renderBreadcrumb(matchedPage, routeParams) {
    let props = this.props;
    let splitPath = props.splitWindowPath;
    let routes = this.state.routes;

    let breadcrumb = splitPath.map(function(path, index) {
      if (path && path != "" && REMOVE_FROM_BREADCRUMBS.indexOf(path) === -1) {
        // Last element (i.e. current page)
        if (index == splitPath.length - 1) {
          return <li key={index} className="active">{decodeURIComponent(path).replace('&amp;', '&')}</li>;
        }
        else {

          let hrefPath = "/" + splitPath.slice(0, index + 1).join('/');

          /**
          * Replace breadcrumb entry with redirect value. Solved some rendering issues. Needs more robust solution though.
          */
          routes.forEach(function(value, key) {

            let matchTest = this._matchPath(value.get('path'), [ path ]);

            if (matchTest.matched) {

              // Redirect if required
              if (value.has('redirects')) {
                value.get('redirects').forEach(function(redirectValue, key) {

                  if (redirectValue.get('condition')({props: props})) {
                    hrefPath = redirectValue.get('target')({props: props});
                    hrefPath = hrefPath.replace('sections', routeParams.area);

                    return false;
                  }
                }.bind(this));
              }

              // Break out of forEach
              return false;
            }

          }.bind(this));

          return <li key={index}><Link key={index} href={hrefPath}>{decodeURIComponent(path).replace('&amp;', '&')}</Link></li>;
        }
      }
    }.bind(this));
    
    return breadcrumb;
  }

  _renderWithBreadcrumb(reactElement, matchedPage, props) {

    return (
      <div>

        <div className="clearfix">

          {(() => {

            if (selectn("routeParams.area", reactElement.props) && selectn("isConnected", props.computeLogin)) {

              return <ul className={classNames('nav', 'nav-pills', 'pull-right')} style={{"display":"inline-block","verticalAlign":"middle"}}>
                <li role="presentation" className={(reactElement.props.routeParams.area == 'Workspaces') ? 'active' : ''}><Link href={props.windowPath.replace('sections', 'Workspaces')}>Workspace Area</Link></li> <li className={(reactElement.props.routeParams.area == 'sections') ? 'active' : ''} role="presentation"><Link href={props.windowPath.replace('Workspaces', 'sections')}>Published Area</Link></li>
              </ul>;

            }

          })()}

          <ol className={classNames('breadcrumb', 'pull-left')}><li><Link href="/">Home</Link></li>{this._renderBreadcrumb(matchedPage, reactElement.props.routeParams)}</ol>

        </div>

        {reactElement}

      </div>
    )
  }

  /**
  * Tests to see if current URL matches route.
  * Return object with matched boolean and route params returned
  */
  _matchPath(pathMatchArray, urlPath) {

    // Remove empties from path array, return Immutable list
    const currentPathArray = Immutable.fromJS(urlPath.filter(function(e){ return e; }));

    if (pathMatchArray.size != currentPathArray.size) {
      return { matched: false, routeParams: {} };
    }

    let matchedRouteParams = {};

    let matched = pathMatchArray.every(function(value, key) {

      if (value instanceof RegExp) {
        return value.test(currentPathArray.get(key));
      }
      else if (value instanceof paramMatch)
      {
        if (value.hasOwnProperty('matcher')) {
          let testMatch = value.matcher.test(currentPathArray.get(key))

          if (testMatch) {
            matchedRouteParams[value.id] = decodeURI(currentPathArray.get(key));
            return true;
          }
        }

        return false;
      }
      else {
        return value === currentPathArray.get(key); 
      }
    });

    return { matched: matched, routeParams: matchedRouteParams };
  }

  render() {

    const { matchedPage, matchedRouteParams } = this.state;

    let page;

    if (!matchedPage) {
      page = <div>404</div>;
    } else {
      page = this._renderWithBreadcrumb(
          React.cloneElement(matchedPage.get('page').toJS(), { routeParams: matchedRouteParams }),
          matchedPage,
          this.props
      );
    }

    return (
      <div>
        <Navigation routeParams={matchedRouteParams} />
        <div className="main">
          {page}
        </div>
      </div>
    );
  }
}

/**
* Parameter matching class
*/
class paramMatch {
  constructor(id, matcher) {
    this.id = id;
    this.matcher = matcher;
  }
}