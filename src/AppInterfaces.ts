import { Dispatch, SetStateAction } from 'react';

export interface NumberInputProps {
  valueNumber: number;
  values: string[];
  setValues: Dispatch<SetStateAction<string[]>>;
  evaluate: (values: string[]) => void;
  onPressIn?: () => void;
}

export interface OptionPickerProps {
	pickerNumber: number;
  selectedPicker: string[];
  setSelectedPicker: Dispatch<SetStateAction<string[]>>;
  values: string[];
  evaluate: (values: string[]) => void;
}
