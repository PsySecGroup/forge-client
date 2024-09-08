import { Box, Grid } from '@suid/material'
import { type ParentProps, type JSX, createEffect } from 'solid-js'
import { useStoreContext } from '../core'
import styles from './css/tools.module.css'
import Button from '../core/components/button'
import Slider from '../core/components/slider'
import Modal from '../core/components/modal'
import Input from '../core/components/input'
import Select from '../core/components/select'

interface Props extends ParentProps {}

export default function ToolsPage (props: Props): JSX.Element {
  const { values } = useStoreContext()

  const options = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "orange", label: "Orange" },
    "Pineapple", // string shorthand
  ]

  const handleSelectChange = (selectedValue) => {
    console.log("Selected:", selectedValue);
  }

  return (
    <div>
      Tools<br />
      <Button>yo</Button>
      <Slider 
        min={0}
        max={20}
        name={'Slide Me'}
        onUpdate={() => {}}
      />
      {/* <Modal /> */}
      <Input />
      <Select
        label="Favorite Fruit"
        options={options}
        placeholder="Select a fruit"
        onChange={handleSelectChange}
        error="Please select a fruit"
        helperText="Choose your favorite from the options."
        selectStyle={{ borderColor: "green" }}
        attributes={{ required: true }}
      />
      <Select
        label="Select Multiple Fruits"
        options={options}
        multiple
        onChange={handleSelectChange}
        helperText="You can select multiple fruits."
      />
    </div>
  )
}
