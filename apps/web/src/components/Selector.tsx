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
        // indicatorsContainer(base, props) {
        //   return {}
        //   return { ...base, fill: 'white' }
        // },
        placeholder(base, props) {
          console.log('multiValueRemove', props)
          return { ...base, color: undefined }
        },
        multiValueRemove(base, props) {
          console.log('multiValueRemove', props)
          return {}
        },

        indicatorSeparator() {
          return {}
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
            display: 'flex',
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
        // menuList(base, props) {
        //   // const { ...backgroundColor, newBase } = base
        //   return base
        // },
        option(base, props) {
          // const { ...backgroundColor, newBase } = base
          return { ...base, backgroundColor: props.isFocused ? '' : '' }
        },
        menu(base, props) {
          // const { ...backgroundColor, newBase } = base
          return { ...base, color: 'white' }
        },
        multiValue(base, props) {
          // removes backgroundColor
          const { backgroundColor, ...newBase } = base
          return {
            ...newBase,
            backgroundColor: matchColorToSelector(props.data.label),
          }
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
        multiValueLabel: () => 'font-bold',
        clearIndicator: () => 'bg-gray-700',
        dropdownIndicator: () => 'fill-white	',
        indicatorsContainer: () => 'bg-gray-700',
        valueContainer: () => 'bg-gray-400',
        option: (state) => (state.isFocused ? 'bg-gray-800' : ''),
        control(props) {
          const classes = ['bg-gray-800', 'border-2']

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
      // formatOptionLabel={(group) => {
      //   const color = matchColorToSelector(group.label)
      //   return (
      //     <div
      //       style={{
      //         mixBlendMode: 'difference',
      //         filter: 'invert',
      //         backgroundColor: color,
      //       }}
      //     >
      //       {group.label}
      //     </div>
      //   )
      // }}
      onChange={onChange}
      closeMenuOnSelect={false}
      options={availableOptions}
      hideSelectedOptions
      // isOptionSelected={()}
      isOptionDisabled={(option) => {
        console.log('option.isSelected', option.isSelected)
        const isSelectedOption = isSelected(option)
        // console.log('ISDISABLE', {
        //   label: option.label,
        //   isDisabled: isSelectedOption,
        // })
        return option.isSelected
      }}
      defaultValue={selectedOptions}
      isMulti
    />
  )
}
