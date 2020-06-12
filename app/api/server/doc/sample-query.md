# Query

```graphql
# Write your query or mutation here

query getTrack {
  track(id: 1) {
    id
    name
    path
    level
    difficulty
    bt_long
  }
}

query getTracks($tracksInput: tracksInput) {
  tracks(input: $tracksInput, first: 2, offset: 1) {
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

mutation updateComment($updateTrackInput: updateTrackInput!) {
  updateTrack(input: $updateTrackInput) {
    name
    level
    difficulty
    niju
  }
}
```


# Query Variables

```json
{
  "tracksInput": {
		"level": 18
  },

  "updateTrackInput": {
    "id": 1,
    "niju": 22
  }
}
```