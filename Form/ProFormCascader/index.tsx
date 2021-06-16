import React from 'react';
import { Cascader, CascaderProps } from 'antd';
import { ProFieldFCRenderProps } from '@ant-design/pro-provider';
import { createProFormField } from '../createProFormField';


function render(text, props: ProFieldFCRenderProps) {
  return (
    <Cascader {...props} {...props.fieldProps}/>
  );
}

export const ProFormCascader = createProFormField<CascaderProps>({ render });

