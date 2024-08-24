import { FC } from 'react'
import Select, {
  ActionMeta,
  OptionProps,
  OnChangeValue,
  createFilter,
} from 'react-select'
import invertColor from 'invert-color'
import { matchColorToSelector } from '../helpers/alphaNumericColorMatcher'

const generateOptionFromValue = (val: string) => ({ value: val, label: val })
export const generationOptionsFromListOfValues = (vals: string[]) =>
  vals.map(generateOptionFromValue)

export interface SelectorProps {
  isSelected(option: OptionProps): boolean
  placeholder: string
  availableOptions: OptionProps[]
  selectedOptions: OptionProps[]
  onChange: (
    newValue: OnChangeValue<OptionProps, boolean>,
    actionMeta: ActionMeta<OptionProps>
  ) => void
}

export const Selector: FC<SelectorProps> = ({
  onChange,
  availableOptions,
  selectedOptions,
  isSelected,
  placeholder,
}) => {
  return (
    <Select
      placeholder={placeholder}
      styles={{
        placeholder(base, props) {
          return { ...base, color: undefined }
        },
        multiValueRemove(base, props) {
          return {}
        },

        indicatorSeparator() {
          return {}
        },
        indicatorsContainer(base, props) {
          return {
            ...base,
            // top: -25,
            // right: 0,
            // position: 'absolute',
          }
        },
        control(base, props) {
          const {
            boxSizing,
            borderStyle,
            borderColor,
            borderWidth,
            border,
            background,
            borderRadius,
            backgroundColor,
            ...newBase
          } = base

          return {
            ...newBase,
            boxShadow: undefined,
            flexGrow: 1,
            width: '100%',
            outline: undefined,
            boxSizing: undefined,
            borderStyle: undefined,
            borderColor: undefined,
            borderWidth: undefined,
            border: undefined,
            background: undefined,
          }
        },

        option(base, props) {
          return { ...base, backgroundColor: props.isFocused ? '' : '' }
        },
        menu(base, props) {
          return { ...base, color: 'white' }
        },
        multiValue(base, props) {
          const { backgroundColor, ...newBase } = base
          return {
            ...newBase,
            backgroundColor: matchColorToSelector(props.data.label),
          }
        },
        valueContainer(base, props) {
          return { ...base, width: '100%', padding: undefined }
        },
        multiValueLabel(base, props) {
          return {
            ...base,
            color: invertColor(matchColorToSelector(props.data.label), true),
          }
        },
      }}
      classNames={{
        placeholder: () => 'gray-100',
        container: () => 'flex w-100',
        multiValueRemove: () => 'max-h-10',
        multiValueLabel: () => 'font-bold',
        clearIndicator: () => 'bg-gray-700',
        dropdownIndicator: () => 'fill-white	',
        indicatorsContainer: () => 'flex justify-between bg-gray-700 max-h-10',
        valueContainer: () => 'bg-gray-400 lg:p2',
        option: (state) => (state.isFocused ? 'bg-gray-800' : ''),
        control(props) {
          const classes = ['bg-gray-800', 'flex-col  sm:flex-row', 'border-2']

          if (props.isFocused) {
            classes.push('border-gray-800')
          } else {
            classes.push('border-gray-600')
          }

          return classes.join(' ')
        },
        menuList: () => 'bg-gray-500',
      }}
      filterOption={createFilter({
        ignoreCase: true,
        ignoreAccents: true,
        matchFrom: 'any',
        stringify: (option) => `${option.label} ${option.value}`,
        trim: true,
      })}
      classNamePrefix={'selector'}
      onChange={onChange}
      closeMenuOnSelect={false}
      options={availableOptions}
      hideSelectedOptions
      defaultValue={selectedOptions}
      isMulti
    />
  )
}
