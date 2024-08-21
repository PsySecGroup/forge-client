export default {
  /**
   *
   */
  closeEverything: ({ values, setValues }) => {
    return setValues({
      closeEverything: !values.closeEverything
    })
  }
}
