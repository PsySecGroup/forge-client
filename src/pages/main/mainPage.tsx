import style from './mainPage.module.css'
import { MainPageRouter } from '../router'

export function MainPage () {
  return (
    <div class={style['centered']} >
      <MainPageRouter />
    </div>
  )
}
