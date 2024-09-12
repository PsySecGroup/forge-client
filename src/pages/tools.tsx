import { Box, Grid } from '@suid/material'
import { type ParentProps, type JSX, createEffect } from 'solid-js'
import { useStoreContext } from '../core'
import styles from './css/tools.module.css'
import Button from '../core/components/button'
import Slider from '../core/components/slider'
import Modal from '../core/components/modal'
import Input from '../core/components/input'
import Select from '../core/components/select'
import DatePicker from '../core/components/datePicker'
import Switch from '../core/components/switch'
import Checkbox from '../core/components/checkbox'
import RadioGroup from '../core/components/radioGroup'
import ArrowUpZAIcon from '../core/components/icons/arrowUpZA'
import CabinIcon from '../core/components/icons/cabin'
import Divider from '../core/components/divider'
import Table from '../core/components/table'

interface Props extends ParentProps {}

export default function ToolsPage (props: Props): JSX.Element {
  const { values, setValues } = useStoreContext()

  const handleSelectChange = (selectedValue) => {
    console.log("Selected:", selectedValue);
  }

  const headers = ['Name', 'Age', 'Occupation']
  const rows = [
    ['John Doe', 28, 'Engineer'],
    ['Jane Smith', 34, 'Designer'],
    ['Mike Johnson', 45, 'Developer'],
    ['Sara Lee', null, '']
  ]

  return (
    <div>
      Tools<br />
      <ArrowUpZAIcon />
      <CabinIcon />
      <Divider />
      <Table
        headers={headers}
        rows={rows}
        onSearch={searchTerm => rows.filter(row => row.some(cell => String(cell)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
        ))}
        onNext={() => rows}
        onPrev={() => rows}
      />
      <DatePicker
        value={values.date}
        onChange={date => setValues({
          date
        })}
        minDate={new Date(2020, 0, 1)}
        maxDate={new Date(2030, 11, 31)}
      />
      <RadioGroup
        options={[
          {
            label: 'Yes',
            value: 'yes'
          },
          {
            label: 'No',
            value: 'no'
          },
        ]}
        selectedValue={values.radio}
        onChange={(radio) => setValues({
          radio
        })}
      />
      <Switch 
        checked={values.checked}
        onChange={checked => setValues({
          checked
        })}
      />
      <Checkbox
        checked={values.checked}
        onChange={checked => setValues({
          checked
        })}
      />
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
        options={[
          { value: "apple", label: "Apple" },
          { value: "banana", label: "Banana" },
          { value: "orange", label: "Orange" },
          "Pineapple", // string shorthand
        ]}
        placeholder="Select a fruit"
        onChange={handleSelectChange}
        error="Please select a fruit"
        helperText="Choose your favorite from the options."
        selectStyle={{ borderColor: "green" }}
        attributes={{ required: true }}
      />
    </div>
  )
}
