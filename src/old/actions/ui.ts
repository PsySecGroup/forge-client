export default {
  /**
   * TODO figure out typing
   */
  closeEverything: ({ values, setValues }) => {
    return setValues({
      closeEverything: !values.closeEverything
    })
  }
}
