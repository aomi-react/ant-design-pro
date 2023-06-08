import React from 'react';
import { ProFieldFCRenderProps } from '@ant-design/pro-provider';
import { createProFormField } from '../createProFormField';
import { InputFeeRate, InputFeeRateProps } from '@aomi/react-antd/InputFeeRate/InputFeeRate';


function render(text, props: ProFieldFCRenderProps) {
  return (
    <InputFeeRate {...props} {...props.fieldProps}/>
  );
}

export const ProFormInputFeeRate = createProFormField<InputFeeRateProps>({ render });

