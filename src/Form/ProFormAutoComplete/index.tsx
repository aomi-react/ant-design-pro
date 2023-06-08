import React from 'react';
import { AutoComplete, AutoCompleteProps } from 'antd';
import { ProFieldFCRenderProps } from '@ant-design/pro-provider';
import { createProFormField } from '../createProFormField';


function render(text, props: ProFieldFCRenderProps) {
  return (
    <AutoComplete {...props} {...props.fieldProps}/>
  );
}

export const ProFormAutoComplete = createProFormField<AutoCompleteProps>({ render });

