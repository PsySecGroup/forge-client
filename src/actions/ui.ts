export default {
  /**
   *
   */
  closeEverything: (stores) => {
    return stores.setValues({
      closeEverything: true
    })
  }
}
