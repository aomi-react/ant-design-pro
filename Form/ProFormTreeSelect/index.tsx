import React from 'react';
import { ProFieldFCRenderProps } from '@ant-design/pro-provider';
import { createProFormField } from '../createProFormField';
import { TreeSelect, TreeSelectProps } from 'antd';


function render(text, props: ProFieldFCRenderProps) {
  return (
    <TreeSelect {...props} {...props.fieldProps}/>
  );
}

export const ProFormTreeSelect = createProFormField<TreeSelectProps<any>>({ render });

