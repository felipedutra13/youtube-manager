import axios from "axios";
import { getRandomElementList } from "../utils/utils.js";
import { viewTypes } from "../config/just-watch.js";

function formatOutput(movie) {
  return {
    title: movie.node.content.title,
    duration: `${movie.node.content.runtime} minutos`,
    imdbScore: movie.node.content.scoring.imdbScore
  };
}

function getBody(params) {
  let query = {};
  let variables = {};

  switch (params.type) {
    case "movie":
      query = getMovieQuery(params);
      variables = getMovieVariables(params);
      break;
    case "tv":
      query = getTvQuery(params);
      variables = getTvVariables(params);
      break;
    default:
      throw new Error("Type cannot be found!");
  }

  return { query, variables };
}


function getMovieQuery() {
  return `query GetTitleListV2($country: Country!, $titleListFilter: TitleFilter, $titleListSortBy: TitleListSortingV2! = LAST_ADDED, $titleListType: TitleListTypeV2!, $titleListAfterCursor: String, $first: Int! = 10, $language: Language!, $sortRandomSeed: Int! = 0) {
      titleListV2(
        after: $titleListAfterCursor
        country: $country
        filter: $titleListFilter
        sortBy: $titleListSortBy
        first: $first
        titleListType: $titleListType
        sortRandomSeed: $sortRandomSeed
      ) {
        totalCount
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
          __typename
        }
        edges {
          ...WatchlistTitleGraphql
          __typename
        }
        __typename
      }
    }
    
    fragment WatchlistTitleGraphql on TitleListEdgeV2 {
      node {
        id
        content(country: $country, language: $language) {
          title
          runtime
          scoring {
            imdbScore
          }
        }
      }
    }
    `;
}

function getMovieVariables(params) {
  let { minDuration, maxDuration, minScore, viewType } = params;
  let variablesObj = {
    "titleListSortBy": "LAST_ADDED",
    "first": 250,
    "sortRandomSeed": 0,
    "titleListFilter": {
      "ageCertifications": [],
      "excludeGenres": [],
      "excludeProductionCountries": [],
      "objectTypes": [],
      "productionCountries": [],
      "subgenres": [],
      "genres": [],
      "packages": [
        "dnp",
        "nfx",
        "prv",
        "pmp",
        "mxx",
        "gop",
        "app",
        "aho",
        "atl",
        "ppp",
        "pva"
      ],
      "excludeIrrelevantTitles": false,
      "presentationTypes": [],
      "monetizationTypes": [],
      "runtime": {},
      "includeTitlesWithoutUrl": true
    },
    "watchNowFilter": {
      "packages": [
        "dnp",
        "nfx",
        "prv",
        "pmp",
        "mxx",
        "gop",
        "app",
        "aho",
        "atl",
        "ppp",
        "pva"
      ],
      "monetizationTypes": []
    },
    "language": "pt",
    "country": "BR",
    "titleListType": "WATCHLIST",
    "titleListAfterCursor": ""
  };

  if (minScore) {
    variablesObj.titleListFilter.imdbScore = {
      min: minScore
    };
  }

  if (maxDuration) {
    variablesObj.titleListFilter.runtime.max = minDuration;
    variablesObj.titleListFilter.runtime.max = maxDuration;
  }

  if (viewType) {
    variablesObj.viewType = viewTypes[viewType];
  }

  return variablesObj;
}

function getTvQuery() {
  return `query GetTVShowTracking($country: Country!, $filter: TitleFilter, $viewType: TvShowTrackingType!, $sortBy: TvShowTrackingSorting! = LAST_ADDED, $cursor: String, $first: Int! = 10, $language: Language!, $sortRandomSeed: Int! = 0, $platform: Platform! = WEB) {
    tvShowTracking(
      after: $cursor
      country: $country
      filter: $filter
      sortBy: $sortBy
      first: $first
      viewType: $viewType
      sortRandomSeed: $sortRandomSeed
    ) {
      totalCount
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
        __typename
      }
      edges {
        ...TVShowTrackingTitle
        __typename
      }
      __typename
    }
  }

  fragment TVShowTrackingTitle on TvShowTrackingEdge {
    cursor
    node {
      id
      objectId
      objectType
      offerCount(country: $country, platform: $platform)
      content(country: $country, language: $language) {
        title
        runtime
        scoring {
          imdbScore
        }
      }
    }
  }`;
}

function getTvVariables({ viewType, animation }) {
  return {
    "sortBy": "RELEVANCE",
    "first": 100,
    "sortRandomSeed": 0,
    "includeUnreleasedEpisodes": false,
    "platform": "WEB",
    "filter": {
      "ageCertifications": [],
      "excludeGenres": [],
      "excludeProductionCountries": [],
      "objectTypes": [],
      "productionCountries": [],
      "subgenres": [],
      "genres": (animation ? [ 'ani' ] : []),
      "packages": [],
      "excludeIrrelevantTitles": false,
      "presentationTypes": [],
      "monetizationTypes": [],
      "includeTitlesWithoutUrl": true
    },
    "watchNowFilter": {
      "packages": [],
      "monetizationTypes": []
    },
    "viewType": viewTypes[viewType],
    "language": "pt",
    "country": "BR",
    "cursor": ""
  };
}

class JustWatch {
  async getContent(params) {
    const targetUrl = `https://apis.justwatch.com/graphql`;

    const { query, variables } = getBody(params);

    const config = {
      'method': 'POST',
      'url': targetUrl,
      'headers': {
        "Content-Type": "application/json",
        "authorization": process.env.JUST_WATCH_TOKEN
      },
      'data': {
        'query': query,
        'variables': variables
      }
    };

    try {
      let response = await axios(config);
      const data = response.data.data;
      return (data.titleListV2 || data.tvShowTracking)?.edges;
    } catch (error) {
      console.log(error);
    }
    return [];
  }

  async getRandomMovie(minDuration = 0, maxDuration, minScore) {
    let movies = await this.getContent({ minDuration, maxDuration, minScore, type: "movie" });

    if (!movies.length) {
      return '';
    }

    const movie = getRandomElementList(movies);
    return formatOutput(movie);
  }

  async getRandomTvshow(minScore, viewType, animation) {
    let items = await this.getContent({ minScore, viewType, type: "tv", animation });

    if (!items.length) {
      return '';
    }

    const item = getRandomElementList(items);
    return formatOutput(item);
  }
};

export default JustWatch;