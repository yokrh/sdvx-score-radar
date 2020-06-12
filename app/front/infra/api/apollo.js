/* eslint curly: 0 */

/**
 * Apollo service class.
 */
export default class Apollo {
  constructor(self) {
    if (!self.$apollo) {
      console.log('No apollo') // eslint-disable-line
      return
    }

    // apollo
    this.apollo = self.$apollo
  }

  /**
   * Throw a query.
   */
  async query(query, variables) {
    if (!this.apollo) throw new Error('No apollo')

    const fetchPolicy = 'network-only'
    const res = await this.apollo.query({
      query,
      variables,
      fetchPolicy,
    })

    return res
  }
}
