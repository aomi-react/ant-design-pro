import React, { PropsWithChildren } from 'react';
import { withRouter } from 'react-router-dom';
import { PageContainer, PageContainerProps } from '@ant-design/pro-layout';
import ProForm, { ProFormList, ProFormListProps, ProFormProps } from '@ant-design/pro-form';
import { GroupProps, ProFormItemProps } from '@ant-design/pro-form/es/interface';
import { ProFieldFCRenderProps } from '@ant-design/pro-provider';
import ProCard, { ProCardProps } from '@ant-design/pro-card';

import { renderFormItem } from '../Form/renderFormItem';

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
  | 'autoComplete'

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
  formListProps?: Omit<ProFormListProps, 'name' | 'children'>
  /**
   * 编辑时禁用
   */
  editDisabled?: boolean

  /**
   * 新增时隐藏
   */
  createHidden?: boolean

  /**
   * 自定渲染整个字段
   * @param args 当前字段配置信息
   * @param pageOptions 页面提供的参数
   */
  renderField?: (args: Field, pageOptions: any) => React.ReactNode

  /**
   * 自定义渲染field
   */
  render?: ((text: any, props: ProFieldFCRenderProps, dom: JSX.Element) => JSX.Element) | undefined;

  /**
   * 各个组件对应的props,请根据type参考对应的组件属性
   */
  [key: string]: any
} & ProFormItemProps

export type FieldGroup = {
  fields: Array<Field>
} & GroupProps

export type PersistContainerProps = {
  /**
   * page container props
   */
  container?: PageContainerProps

  /**
   * 卡片属性
   */
  card?: ProCardProps

  /**
   * 表单props
   */
  form?: ProFormProps

  /**
   * 表单字段信息
   */
  fieldGroups?: Array<FieldGroup>

  location?: Location
}

function renderField(args: Field, index, pageOptions) {
  const { renderField: renderFieldComponent, subFieldGroups, formListProps, createHidden, editDisabled, ...field } = args;
  if (renderFieldComponent) {
    return (
      <React.Fragment key={index}>
        {renderFieldComponent({
          width: 'md',
          disabled: pageOptions.updated && editDisabled,
          hidden: pageOptions.created && createHidden,
          ...field
        }, pageOptions)}
      </React.Fragment>
    );
  }
  if (Array.isArray(subFieldGroups) && subFieldGroups.length > 0) {
    return (
      <ProFormList key={index} {...formListProps} name={field.name || 'list'}>
        {subFieldGroups.map((item, idx) => renderFieldGroup(item, idx, pageOptions))}
      </ProFormList>
    );
  }
  return (
    <React.Fragment key={index}>
      {renderFormItem({
        width: 'md',
        disabled: pageOptions.updated && editDisabled,
        hidden: pageOptions.created && createHidden,
        ...field
      })}
    </React.Fragment>
  );
}

function renderFieldGroup({ fields, ...props }, index, pageOptions) {
  return (
    <ProForm.Group size={16} {...props} key={index}>
      {fields.map((item, idx) => renderField(item, idx, pageOptions))}
    </ProForm.Group>
  );
}

/**
 * 新增、编辑页面
 */
export const PersistContainer = withRouter(function PersistContainer(inProps: PropsWithChildren<PersistContainerProps>) {
  const {
    container,
    card,
    form,

    location,

    fieldGroups = [],

    children
  } = inProps;

  const { pathname = '' } = location || {};

  const pageOptions = {
    created: pathname.endsWith('create'),
    updated: pathname.endsWith('updated')
  };

  return (
    <PageContainer {...container}>
      <ProCard size="small" bordered={false} {...card}>
        <ProForm {...form}>
          {fieldGroups.map((item, index) => renderFieldGroup(item, index, pageOptions))}
        </ProForm>
      </ProCard>
      {children}
    </PageContainer>
  );
});
