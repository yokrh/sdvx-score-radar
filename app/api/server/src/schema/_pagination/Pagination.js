/**
 * Pagination class.
 */
class Pagination {
  /**
   * Get connection.
   */
  static getConnection(nodes) {
    const totalCount = nodes.length
    const edges = this.getEdges(nodes)
    const pageInfo = this.getPageInfo(edges)
    return { totalCount, edges, pageInfo }
  }

  /**
   * Get edges.
   */
  static getEdges(nodes) {
    return nodes.map(node => this.getEdge(node))
  }

  /**
   * Get edge.
   */
  static getEdge(node) {
    const cursor = this.getCursor(node)
    return { cursor, node }
  }

  /**
   * Get cursor.
   */
  static getCursor(node) {
    return `cursor:${node.id}`  // tekito-
  }

  /**
   * Get page info.
   */
  static getPageInfo(edges) {
    const startCursor = edges.length > 0 ? this.getCursor(edges[0].node) : null
    const endCursor = edges.length > 0 ? this.getCursor(edges[edges.length-1].node) : null
    const hasPreviousPage = false  // tekito-. Need db info in real case.
    const hasNextPage = false  // tekito-. Need db info in real case.
    return {
      startCursor,
      endCursor,
      hasPreviousPage,
      hasNextPage,
    }
  }
}

module.exports = Pagination;
