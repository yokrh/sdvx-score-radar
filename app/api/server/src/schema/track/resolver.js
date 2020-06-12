const Pagination = require('../_pagination/Pagination.js')
const TrackConnector = require('./connector/connector.js')

const Query = {
  track: async (parent, args, context, info) => {
    console.log('track', args)
    const res = await TrackConnector.fetchTrack(args.id)
    return res
  },

  tracks: async (parent, args, context, info) => {
    console.log('tracks', args)
    const res = await TrackConnector.fetchTracks(
      args.input,
      args.first,
      args.offset
    )
    return Pagination.getConnection(res)
  },
};

const Mutation = {
  updateTrack: async (parent, args, context, info) => {
    console.log('updateTrack', args)
    const res = await TrackConnector.updateTrack(args.input)
    return res
  },
};

const resolver = {
  Query,
  Mutation,
};

module.exports = resolver;