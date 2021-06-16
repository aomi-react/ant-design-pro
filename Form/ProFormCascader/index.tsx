import React from 'react';
import { Cascader, CascaderProps } from 'antd';
import { ProFieldFCRenderProps } from '@ant-design/pro-provider';
import { createProFormField } from '../createProFormField';


function renderFormItem(text, props: ProFieldFCRenderProps) {
  return (
    <Cascader {...props.fieldProps}/>
  );
}

export const ProFormCascader = createProFormField<CascaderProps>(renderFormItem);

