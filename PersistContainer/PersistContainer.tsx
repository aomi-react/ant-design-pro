import React, { PropsWithChildren } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { PageContainer, PageContainerProps } from '@ant-design/pro-layout';
import ProForm, { ProFormDependency, ProFormList, ProFormListProps, ProFormProps } from '@ant-design/pro-form';
import { GroupProps, ProFormItemProps } from '@ant-design/pro-form/es/interface';
import { ProFieldFCRenderProps } from '@ant-design/pro-provider';
import ProCard, { ProCardProps } from '@ant-design/pro-card';

import { renderFormItem } from '../Form/renderFormItem';
import { Rule } from 'rc-field-form/lib/interface';
import { navigationServices } from '@aomi/mobx-history';
import { ObjectUtils } from '@aomi/utils/ObjectUtils';

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
  | 'cascader'

  // 自定义组件
  | 'feeRate'

export type Field = {
  /**
   * 字段类型
   */
  type?: FieldType
  /**
   * 字段名称
   */
  name: string | Array<string | number>
  /**
   * 依赖的字段名称
   */
  dependencyName?: Array<string | Array<string | number>>
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
   * 是否允许留空白
   * 默认true
   */
  whitespace?: boolean

  /**
   * 自定渲染整个字段
   * @param args 当前字段配置信息
   * @param pageOptions 页面提供的参数
   */
  renderField?: (args: Field, pageOptions: any) => React.ReactNode

  /**
   * 渲染带有依赖关系的字段
   * 使用ProFormDependency组件包裹
   * 当使用该值时,dependencyName 字段必填
   * @param args 当前field参数
   * @param pageOptions 页面参数
   * @param dependencyFieldValues 依赖的字段值
   */
  renderDependencyField?: (args: Field, pageOptions: any, dependencyFieldValues: Record<string, any>) => React.ReactNode

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

export type PageOptions = {
  created: boolean
  updated: boolean
}

export type PersistContainerProps = {

  createTitle?: React.ReactNode | false;
  createSubTitle?: React.ReactNode | false;

  editTitle?: React.ReactNode | false;
  editSubTitle?: React.ReactNode | false;

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
  form?: Omit<ProFormProps, 'onFinish'>

  /**
   * 表单字段信息
   */
  fieldGroups?: Array<FieldGroup>

  onFinish: (values, pageOptions: PageOptions) => Promise<void>

  getInitialValues?: (data: { params: any, pageOptions: PageOptions }) => any

  location?: Location
}

function renderField(args: Field, index, pageOptions) {
  const { renderDependencyField, renderField: renderFieldComponent, subFieldGroups, dependencyName, formListProps, createHidden, editDisabled, whitespace = true, rules = [], ...field } = args;

  const newRules: Rule[] = [...rules];
  if (field.required) {
    newRules.push({ required: true, message: `${field.label} 是必填字段` });
  }
  if (whitespace && ['text', 'textarea'].includes(field.type || '')) {
    newRules.push({
      whitespace
    });
  }

  const fieldOptions: Field = {
    width: 'md',
    disabled: pageOptions.updated && editDisabled,
    hidden: pageOptions.created && createHidden,
    rules: newRules,
    ...field
  };

  if (renderDependencyField) {
    return (
      <ProFormDependency name={dependencyName || []} key={index}>
        {(dependencyFieldValues) => renderDependencyField(args, pageOptions, dependencyFieldValues)}
      </ProFormDependency>
    );
  }

  if (renderFieldComponent) {
    return (
      <React.Fragment key={index}>
        {renderFieldComponent(fieldOptions, pageOptions)}
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
      {renderFormItem(fieldOptions)}
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
export const PersistContainer: React.FC<PersistContainerProps> = observer(withRouter(function PersistContainer(inProps: PropsWithChildren<PersistContainerProps>) {
  const {

    createTitle,
    createSubTitle,
    editTitle,
    editSubTitle,

    container,
    card,
    form,

    location,

    fieldGroups = [],

    onFinish,
    getInitialValues,

    children
  } = inProps;

  const { pathname = '', params = undefined } = (location as any) || {};

  const pageOptions = {
    created: pathname.endsWith('create'),
    updated: pathname.endsWith('update')
  };

  if (pageOptions.updated && !params) {
    console.warn('进入更新页面,但是没有发现需要编辑的数据.自动返回上一页');
    navigationServices.goBack();
  }

  let initialValues = {};
  if (getInitialValues) {
    initialValues = getInitialValues({
      params: params || {},
      pageOptions,
    });
  } else if (Array.isArray(params?.selectedRows)) {
    initialValues = params.selectedRows[0] || {};
  } else {
    initialValues = params;
  }

  async function handleFinish(values) {
    onFinish && await onFinish(ObjectUtils.deepmerge(initialValues, values), pageOptions);
  }

  const title = pageOptions.created ? createTitle : editTitle;
  const subtitle = pageOptions.created ? createSubTitle : editSubTitle;

  return (
    <PageContainer title={title} subTitle={subtitle} {...container}>
      <ProCard size="small" bordered={false} {...card}>
        <ProForm {...form} onFinish={handleFinish} initialValues={initialValues}>
          {fieldGroups.map((item, index) => renderFieldGroup(item, index, pageOptions))}
        </ProForm>
      </ProCard>
      {children}
    </PageContainer>
  );
}));
