import { useContext } from 'solid-js'
import { formsContext, getFormsActions } from './formsState'

export function Forms() {
  const [state] = useContext(formsContext)
  const { updateName } = getFormsActions()

  const handleInputChange = ({ target }: InputEvent) => {
    updateName((target as HTMLInputElement).value)
  };

  return (
    <>
      <span>{state.name}</span>
      <input 
        value={state.name}
        onInput={handleInputChange}
      />
    </>
  )
}
