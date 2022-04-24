import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Clipboard from '@react-native-clipboard/clipboard';

import { NumberInputProps, OptionPickerProps } from './AppInterfaces';
import { Traits } from './traits';

const NumberInput = ({ 
  valueNumber, 
  values, 
  setValues, 
  evaluate, 
  onPressIn
}: NumberInputProps) => {
  let inputRef: TextInput | null = null;
  const { numberInput } = styles;
  const handleChangeText = async (text: string) => {
    const newValues = [...values];
    newValues[valueNumber - 1] = text;
    setValues(newValues);
    evaluate(newValues);
  };

  React.useEffect(() => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      if (valueNumber === 1) inputRef && inputRef.focus();
    }
  }, [valueNumber, inputRef]);

  const value = values[valueNumber - 1];
  const valueLengthWithLimit = value.length < 1 ? 1 : value.length;
  const fontSize = Math.sqrt(
    (Traits.inputWidth * Traits.inputHeight) / valueLengthWithLimit
  );

  return (
    <TextInput
      ref={(ref) => (inputRef = ref)}
      value={value}
      style={[numberInput, { fontSize }]}
      keyboardType="decimal-pad"
      onChangeText={handleChangeText}
      numberOfLines={1}
      onPressIn={onPressIn}
      keyboardAppearance="dark"
    />
  );
};

const OptionPicker = ({
  pickerNumber,
  selectedPicker,
  setSelectedPicker,
  evaluate,
  values,
}: OptionPickerProps) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const options = ['g', 'oz', 'lbs', 'ml', 'floz', 'kcal'];
  const { picker } = styles;
  const pickerItems = options.map((item) => (
    <Picker.Item
      label={item}
      value={item}
      color={Platform.OS === 'ios' ? 'white' : 'red'}
    />
  ));

  const handleValueChange = (value: string) => {
    evaluate(values);
    const newSelectedPicker = [...selectedPicker];
    newSelectedPicker[pickerNumber - 1] = value;
    setSelectedPicker(newSelectedPicker);
  };

  return (
    <Picker
      style={picker}
      itemStyle={{ color: 'white' }}
      selectedValue={selectedPicker[pickerNumber - 1]}
      onValueChange={handleValueChange}
      dropdownIconColor="white">
      {pickerItems}
    </Picker>
  );
};

export default function App() {
  const [values, setValues] = React.useState<string[]>(['', '', '', '']);
  const [selectedPicker, setSelectedPicker] = React.useState<string[]>([
    'g',
    'kcal',
    'g',
    'kcal',
  ]);
  const [fourthValue, setFourthValue] = React.useState<Number>(0);

  const {
    row,
    container,
    wrapper,
    dividerStroke,
    separatorRow,
    separatorColumn,
    separatorPicker,
    result,
    resultTxt,
  } = styles;

  const convertMeasures = (values: string[]) => {
    const numbers = values.map((item) => Number(item));
    if (selectedPicker[0] === 'g' && selectedPicker[1] === 'oz') {
      numbers[1] = (1600000 * numbers[0]) / 45359237;
    }
    const newValues = numbers.map((item) => item.toString());
    setValues(newValues);
  };

  const evaluate = (values: string[]) => {
    // if (selectedPicker[1] !== 'kcal') {
    //   convertMeasures(values);
    //   return;
    // }
    const numbers = values.map((item) => Number(item));
    for (let number of numbers) {
      if (isNaN(number)) return;
    }

    if (selectedPicker[0] === 'oz' && selectedPicker[2] == 'lbs') {
      numbers[2] = numbers[2] * 16;
    }

    const newValues = [...values];
    const fourthValue = (numbers[1] * numbers[2]) / numbers[0];
    if (isNaN(fourthValue) || fourthValue === 0 || !isFinite(fourthValue)) {
      newValues[3] = '';
      setValues(newValues);
      return;
    }
    newValues[3] = Number(fourthValue.toFixed(2)).toString();
    setValues(newValues);
    setFourthValue(fourthValue);
  };

  const showWholeFourthNumber = () => {
    const onCopyPress = () => {
      Clipboard.setString(fourthValue.toString());
    };

    Alert.alert('', fourthValue.toString(), [
      { text: 'ok', onPress: () => {} },
      { text: 'copy', onPress: onCopyPress },
    ]);
  };

  return (
    <KeyboardAvoidingView style={container} behavior="padding">
      <StatusBar barStyle="light-content" />
      <View style={wrapper}>
        <View style={row}>
          <NumberInput
            valueNumber={1}
            values={values}
            setValues={setValues}
            evaluate={evaluate}
          />
          <View style={separatorPicker} />
          <OptionPicker
            pickerNumber={1}
            selectedPicker={selectedPicker}
            setSelectedPicker={setSelectedPicker}
            evaluate={evaluate}
            values={values}
          />
          <View style={separatorColumn} />
          <NumberInput
            valueNumber={2}
            values={values}
            setValues={setValues}
            evaluate={evaluate}
          />
          <View style={separatorPicker} />
          <OptionPicker
            pickerNumber={2}
            selectedPicker={selectedPicker}
            setSelectedPicker={setSelectedPicker}
            evaluate={evaluate}
            values={values}
          />
        </View>
        <View style={separatorRow}>
          <View style={dividerStroke} />
          <View style={dividerStroke} />
        </View>
        <View style={row}>
          <NumberInput
            valueNumber={3}
            values={values}
            setValues={setValues}
            evaluate={evaluate}
          />
          <View style={separatorPicker} />
          <OptionPicker
            pickerNumber={3}
            selectedPicker={selectedPicker}
            setSelectedPicker={setSelectedPicker}
            evaluate={evaluate}
            values={values}
          />
          <View style={separatorColumn} />
          <View>
            <NumberInput
              valueNumber={4}
              values={values}
              setValues={setValues}
              evaluate={evaluate}
              onPressIn={showWholeFourthNumber}
            />
          </View>
          <View style={separatorPicker} />
          <OptionPicker
            pickerNumber={4}
            selectedPicker={selectedPicker}
            setSelectedPicker={setSelectedPicker}
            evaluate={evaluate}
            values={values}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#31343a',
    padding: 8,
  },

  numberInput: {
    width: Traits.inputWidth,
    height: Traits.inputHeight,
    borderWidth: 1,
    textAlign: 'center',
    textAlignVertical: 'top',
    padding: 0,
    color: 'white',
    borderColor: 'white',
  },

  separatorPicker: {
    marginRight: 5,
  },

  wrapper: {
    alignSelf: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  separatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  separatorColumn: {
    marginRight: Traits.columnMargin,
  },

  dividerStroke: {
    marginVertical: Traits.rowMargin,
    borderBottomWidth: 2,
    flex: 1,
    marginHorizontal: 10,
    borderColor: 'white',
  },

  picker: {
    width: Traits.pickerSize,
  },

  pickerItem: {
    color: 'white',
  },

  result: {
    position: 'absolute',
    bottom: -35,
    right: 0,
  },

  resultTxt: {
    color: 'white',
  },
});
