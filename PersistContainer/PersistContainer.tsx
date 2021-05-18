import React, { PropsWithChildren } from 'react';
import { PageContainer, PageContainerProps } from '@ant-design/pro-layout';
import { Button } from 'antd';
import ProForm, { ProFormList, ProFormListProps, ProFormProps } from '@ant-design/pro-form';
import { GroupProps, ProFormItemProps } from '@ant-design/pro-form/es/interface';
import { renderFieldComponent } from './renderFieldComponent';


export type FieldType = 'text'
  | 'password'
  | 'captcha'
  | 'datePicker'
  | 'dateTimePicker'
  | 'dateRangePicker'
  | 'dateTimeRangePicker'
  | 'timePicker'
  | 'textArea'
  | 'checkbox'
  | 'radioGroup'
  | 'switch'
  | 'rate'
  | 'slider'
  | 'uploadDragger'
  | 'uploadButton'
  | 'select'
  | 'digit'

export type Field = {
  /**
   * 字段类型
   */
  type?: FieldType
  /**
   * 字段名称
   */
  name: string
  /**
   * 数组字段配置
   */
  subFieldGroups?: Array<FieldGroup>
  /**
   * form list props 当 subFieldGroups 存在时有效
   */
  formListProps?: ProFormListProps

  /**
   * 自定义渲染field
   */
  render?: (field: Field) => React.ReactNode

  /**
   * 各个组件对应的props,请根据type参考对应的组件属性
   */
  [key: string]: any
} & ProFormItemProps

export type FieldGroup = {
  fields: Array<Field>
} & GroupProps

export type PersistContainerProps = {
  container?: PageContainerProps

  form?: ProFormProps

  fieldGroups?: Array<FieldGroup>
}

function renderField({ subFieldGroups, formListProps, ...field }: Field, index) {
  if (Array.isArray(subFieldGroups) && subFieldGroups.length > 0) {
    return (
      <ProFormList key={index} name={field.name || 'list'}>
        {subFieldGroups.map(renderFieldGroup)}
      </ProFormList>
    );
  }
  return renderFieldComponent(field);
}

function renderFieldGroup({ fields, ...props }, index) {
  return (
    <ProForm.Group {...props} key={index}>
      {fields.map(renderField)}
    </ProForm.Group>
  );
}

export function PersistContainer(inProps: PropsWithChildren<PersistContainerProps>) {
  const {
    container,
    form,

    fieldGroups = []
  } = inProps;

  const footer = [
    <Button key="reset">
      {'重置'}
    </Button>,
    <Button key="submit" type="primary">
      {'提交'}
    </Button>,
  ];

  return (
    <PageContainer footer={footer}
                   {...container}
    >
      <ProForm {...form}>
        {fieldGroups.map(renderFieldGroup)}
      </ProForm>
    </PageContainer>
  );
}
