import gql from 'graphql-tag'

/**
 * Get tracks.
 */
export const GET_TRACKS = gql`
  query getTracks($tracksInput: tracksInput, $first: Int, $offset: Int) {
    tracks(input: $tracksInput, first: $first, offset: $offset) {
      totalCount
      edges {
        node {
          id
          name
          path
          youtube
          ver
          level
          difficulty
          bt_long
          douji
          niju
          tateren
          trill
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`

const GQL = {
  GET_TRACKS,
}

export default GQL
