import React from 'react';
import createField from '@ant-design/pro-form/es/BaseForm/createField';
import ProField from '@ant-design/pro-field';
import { ProFormItemProps } from '@ant-design/pro-form/es/interface';


export function createProFormField<P = any>(render) {
  return createField(({ fieldProps, proFieldProps }: ProFormItemProps<P>) => (
    <ProField mode="edit" fieldProps={fieldProps} {...proFieldProps} renderFormItem={render}/>
  ));
}


