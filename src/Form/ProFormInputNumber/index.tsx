import React from 'react';
import { ProFieldFCRenderProps } from '@ant-design/pro-provider';
import { createProFormField } from '../createProFormField';
import { InputNumber, InputNumberProps } from 'antd';


function render(text, props: ProFieldFCRenderProps) {
  return (
    <InputNumber {...props} {...props.fieldProps}/>
  );
}

export const ProFormInputNumber = createProFormField<InputNumberProps>({ render });

