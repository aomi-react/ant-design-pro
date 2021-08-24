import React from 'react';
import createField from '@ant-design/pro-form/es/BaseForm/createField';
import ProField from '@ant-design/pro-field';
import { ProFieldValueObjectType, ProFieldValueType } from '@ant-design/pro-utils';
import { ProFieldFCRenderProps } from '@ant-design/pro-provider';
import { ProFormItemProps } from '@ant-design/pro-form';


export type Args = {
  render: ((text: any, props: ProFieldFCRenderProps, dom: JSX.Element) => JSX.Element) | undefined;
  valueType?: ProFieldValueType | ProFieldValueObjectType;
}

export function createProFormField<P = any>({ render, valueType }: Args) {
  const ProFormField: React.FC<ProFormItemProps<P>> = React.forwardRef(
    ({ proFieldProps, fieldProps }, ref) => (
      <ProField
        ref={ref}
        mode="edit"
        valueType={valueType}
        fieldProps={fieldProps}
        {...proFieldProps}
        renderFormItem={render}
      />
    ),
  );

  return createField(ProFormField, {
    valueType: (valueType as any),
    customLightMode: true,
  });
}


