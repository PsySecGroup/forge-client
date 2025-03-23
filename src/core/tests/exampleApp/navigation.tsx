import { getNavigationActions, NavigationProvider } from '../../state/navigation'

export function NavigationCompoonent () {
  const { goto, goBack, goForward } = getNavigationActions()

  return (<NavigationProvider>
    <button id="gotoA" onClick={() => goto('A')} />
    <button id="gotoB" onClick={() => goto('B')} />
    <button id="gotoC" onClick={() => goto('C')} />
    <button id="back1" onClick={() => goBack(1)} />
    <button id="back2" onClick={() => goBack(2)} />
    <button id="back3" onClick={() => goBack(3)} />
    <button id="forward1" onClick={() => goForward(1)} />
    <button id="forward2" onClick={() => goForward(2)} />
    <button id="forward3" onClick={() => goForward(3)} />
  </NavigationProvider>)
}