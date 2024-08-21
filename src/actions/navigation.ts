export default {
  /**
   *
   */
  changeLocation: (target: string, { navigation, setNavigation }) => {
    if (navigation.location === target) {
      return
    }

    window.location.hash = `#${target}`

    return setNavigation({
      location: target
    })
  }
}
