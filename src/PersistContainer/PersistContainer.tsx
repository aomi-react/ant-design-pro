import React, { PropsWithChildren, useContext, useEffect } from "react";
import { observer } from "mobx-react";
import { PageContainer, PageContainerProps } from "@ant-design/pro-layout";
import ProForm, {
  ProFormDependency,
  ProFormFieldProps,
  ProFormList,
  ProFormListProps,
  ProFormProps,
  StepFormProps,
  StepsForm,
  StepsFormProps,
} from "@ant-design/pro-form";
import ProCard, { ProCardProps } from "@ant-design/pro-card";

import { renderFormField } from "../Form/renderFormItem";
import { Rule } from "rc-field-form/lib/interface";
import { ObjectUtils } from "@aomi/utils";
import { FormInstance } from "antd";
import { AntDesignProContext } from "../provider";
import {
  ProFormFieldItemProps,
  ProFormGroupProps,
} from "@ant-design/pro-form/es/typing";
import { ListFieldOptions } from "./list-item";
import { PageOptions } from "./page";
import { ProFormItemProps } from "@ant-design/pro-form/es/components";

export type FieldType =
  | ProFormItemProps["valueType"]
  | "uploadDragger"
  | "uploadButton"
  // 自定义组件, 和valueTypeMap中对应
  | "autoComplete"
  | "transfer";

export type Field = {
  /**
   * 字段类型
   * @deprecated 使用 valueType
   */
  type?: FieldType;
  /**
   * 值类型
   */
  valueType?: FieldType;
  /**
   * 字段名称
   */
  name: string | Array<string | number>;
  /**
   * 依赖的字段名称
   */
  dependencyName?: Array<string | Array<string | number>>;
  /**
   * 数组字段配置
   */
  subFieldGroups?: Array<FieldGroup>;
  /**
   * form list props 当 subFieldGroups 存在时有效
   */
  formListProps?: Omit<ProFormListProps<any>, "name" | "children">;
  /**
   * 编辑时禁用
   */
  editDisabled?: boolean;

  /**
   * 新增时隐藏
   */
  createHidden?: boolean;

  /**
   * 是否允许留空白
   * 默认true
   */
  whitespace?: boolean;

  /**
   * 自定渲染整个字段
   * @param args 当前字段配置信息
   * @param options 页面提供的参数
   */
  renderField?: (args: Field, options: RenderFieldOption) => React.ReactNode;

  /**
   * 渲染带有依赖关系的字段
   * 使用ProFormDependency组件包裹
   * 当使用该值时,dependencyName 字段必填
   * @param args 当前field参数
   * @param pageOptions 页面参数
   * @param dependencyFieldValues 依赖的字段值
   */
  renderDependencyField?: <Values>(
    args: Field,
    dependencyFieldValues: Record<string, any>,
    form: FormInstance<Values>,
    options: RenderFieldOption
  ) => React.ReactNode;

  // /**
  //  * 自定义渲染field的相关属性，提供以后根据属性自动渲染
  //  */
  // proFormFieldProps?: ProFormFieldProps;
} & ProFormFieldItemProps &
  Omit<ProFormFieldProps, "valueType">;

export type FieldGroup = {
  /**
   * 字段信息数据
   */
  fields: Array<Field>;
  /**
   * 自定义渲染group标题
   * @param title 标题dom
   * @param props group ProFormBaseGroupProps
   * @param options
   */
  titleRender?: (
    title: React.ReactNode,
    props: any,
    options: RenderFieldGroupOption
  ) => React.ReactNode;

  /**
   * 默认组件宽度 当grid为false时生效
   */
  defaultWidth?: Field["width"];
  /**
   * 默认组件col配置 当grid为true时生效
   */
  defaultColProps?: Field["colProps"];
} & Omit<ProFormGroupProps, "titleRender">;

export type StepsFieldGroup = StepFormProps & {
  fieldGroups?: Array<FieldGroup>;
};

export enum FormType {
  /**
   * 默认表单
   */
  DEFAULT,
  /**
   * 分步表单
   */
  STEP,
}

export type PersistContainerProps = {
  createTitle?: React.ReactNode | false;
  createSubTitle?: React.ReactNode | false;

  editTitle?: React.ReactNode | false;
  editSubTitle?: React.ReactNode | false;

  /**
   * 创建合并的数据删除 id 字段
   */
  createRemoveId?: boolean;

  /**
   * page container props
   */
  container?: PageContainerProps;

  /**
   * 卡片属性
   */
  card?: ProCardProps;

  /**
   * 表单类型
   * 单个表单和分布表单
   */
  formType?: FormType;

  /**
   * 表单props
   */
  formProps?: Omit<ProFormProps, "onFinish"> | Omit<StepsFormProps, "onFinish">;

  /**
   * 默认组件宽度 当grid为false时生效
   */
  defaultWidth?: Field["width"];
  /**
   * 默认组件col配置 当grid为true时生效
   */
  defaultColProps?: Field["colProps"];

  /**
   * 表单字段信息
   */
  fieldGroups?: Array<FieldGroup>;

  /**
   * 分步表单字段信息
   */
  stepsFieldGroups?: Array<StepsFieldGroup>;

  onFinish: (values, pageOptions: PageOptions) => Promise<void>;

  getInitialValues?: (data: { params: any; pageOptions: PageOptions }) => any;

  location?: Location;
};

export type RenderFieldOption = {
  pageOptions?: PageOptions;
  /**
   * 开启grid布局
   */
  grid?: boolean;
  /**
   * 默认列配置，grid为true时生效
   */
  defaultColProps?: Field["colProps"];
  /**
   * 默认宽度，grid为false时生效
   * 默认值 md
   */
  defaultWidth?: Field["width"];
};

/**
 * 渲染一个字段
 * @param args 字段参数
 * @param index 下标
 * @param pageOptions 页面参数
 * @param grid 是否使用grid布局
 * @param defaultWidth 默认宽度
 * @param defaultColProps 默认col
 */
export function renderField(
  args: Field,
  index: number,
  options: RenderFieldOption
) {
  const {
    renderDependencyField,
    renderField: renderFieldComponent,
    subFieldGroups,
    dependencyName,
    formListProps,
    createHidden,
    editDisabled,
    whitespace = true,
    rules = [],
    ...field
  } = args;

  const {
    pageOptions = { created: true, updated: false },
    grid = false,

    defaultWidth = "md",
    defaultColProps = {
      span: 8,
    },
  } = options;

  if (createHidden && pageOptions.created) {
    return undefined;
  }

  const newRules: Rule[] = [...rules];
  if (field.required) {
    newRules.push({ required: true, message: `${field.label} 是必填字段` });
  }
  if (whitespace && ["text", "textarea"].includes(field.type || "")) {
    newRules.push({
      whitespace,
    });
  }

  const fieldOptions: Field = {
    disabled: pageOptions.updated && editDisabled,
    rules: newRules,
    ...field,
  };
  if (grid) {
    fieldOptions.fieldProps = {
      style: { width: "100%" },
      ...fieldOptions.fieldProps,
    };
    fieldOptions.colProps = {
      ...defaultColProps,
      ...fieldOptions.colProps,
    };
  } else if (!Reflect.has(fieldOptions, "width")) {
    // 不包含width 字段，设置默认width
    fieldOptions.width = defaultWidth;
  }

  if (renderDependencyField) {
    return (
      <ProFormDependency name={dependencyName || []} key={index}>
        {(dependencyFieldValues, form) =>
          renderDependencyField(
            fieldOptions,
            dependencyFieldValues,
            form,
            options
          )
        }
      </ProFormDependency>
    );
  }

  if (renderFieldComponent) {
    return (
      <React.Fragment key={index}>
        {renderFieldComponent(fieldOptions, options)}
      </React.Fragment>
    );
  }
  if (Array.isArray(subFieldGroups) && subFieldGroups.length > 0) {
    return (
      <ProFormList key={index} {...formListProps} name={field.name || "list"}>
        {(meta, idx, action, count) => {
          return subFieldGroups.map((item, idx) =>
            renderFieldGroup(item, idx, {
              ...options,
              listFieldOptions: {
                meta,
                index: idx,
                action,
                count,
              },
            })
          );
        }}
      </ProFormList>
    );
  }
  return (
    <React.Fragment key={index}>{renderFormField(fieldOptions)}</React.Fragment>
  );
}

export type RenderFieldGroupOption = RenderFieldOption & {
  listFieldOptions?: ListFieldOptions;
};

/**
 * 渲染ProForm.Group
 * @param fields 字段
 * @param titleRender
 * @param props 其他额皮质
 * @param index 组索引
 * @param options 页面选项
 */
export function renderFieldGroup(
  { fields, titleRender, defaultWidth, defaultColProps, ...props }: FieldGroup,
  index: number,
  options: RenderFieldGroupOption
) {
  const newOptions = {
    ...options,
  };
  if (!Reflect.has(newOptions, "defaultWidth")) {
    newOptions.defaultWidth = defaultWidth;
  }
  if (!Reflect.has(newOptions, "defaultColProps")) {
    newOptions.defaultColProps = defaultColProps;
  }

  function titleRenderWrapper(t: any, p: any) {
    return titleRender ? titleRender(t, p, newOptions) : t;
  }

  return (
    <ProForm.Group
      size={16}
      {...props}
      titleRender={titleRenderWrapper}
      key={index}
    >
      {fields.map((item, idx) => renderField(item, idx, newOptions))}
    </ProForm.Group>
  );
}

/**
 * 新增、编辑页面
 */
export const PersistContainer: React.FC<PersistContainerProps> = observer(
  function PersistContainer(inProps: PropsWithChildren<PersistContainerProps>) {
    const context = useContext(AntDesignProContext);

    const {
      createTitle,
      createSubTitle,
      editTitle,
      editSubTitle,

      createRemoveId = true,

      container,
      card,
      formType = FormType.DEFAULT,
      formProps,
      fieldGroups = [],
      stepsFieldGroups = [],
      defaultWidth,
      defaultColProps,

      onFinish,
      getInitialValues,

      children,
    } = inProps;

    const params = context?.getParams();
    const pathname = context?.getPathname() ?? "";

    const pageOptions = {
      created: pathname.endsWith("create"),
      updated: pathname.endsWith("update"),
    };

    useEffect(() => {
      if (pageOptions.updated && !params) {
        console.warn("进入更新页面,但是没有发现需要编辑的数据.自动返回上一页");
        context?.goBack();
      }
    }, [pageOptions, params, context]);

    let initialValues = {};
    if (getInitialValues) {
      initialValues =
        getInitialValues({
          params: params || {},
          pageOptions,
        }) || {};
    } else if (Array.isArray(params?.selectedRows)) {
      initialValues = params.selectedRows[0] || {};
    } else {
      initialValues = params || {};
    }
    if (pageOptions.created && createRemoveId) {
      console.info("新增页面,移除初始化数据中的ID字段");
      Reflect.deleteProperty(initialValues, "id");
    }

    async function handleFinish(values) {
      onFinish &&
        (await onFinish(
          ObjectUtils.deepmerge(initialValues, values),
          pageOptions
        ));
    }

    const title = pageOptions.created ? createTitle : editTitle;
    const subtitle = pageOptions.created ? createSubTitle : editSubTitle;

    return (
      <PageContainer
        title={title}
        subTitle={subtitle}
        onBack={context?.goBack}
        {...container}
      >
        <ProCard bordered={false} {...card}>
          {formType === FormType.DEFAULT && (
            <ProForm
              scrollToFirstError
              {...formProps}
              onFinish={handleFinish}
              initialValues={initialValues}
            >
              {fieldGroups.map((item, index) =>
                renderFieldGroup(item, index, {
                  pageOptions,
                  grid: (formProps ?? ({} as any)).grid,
                  defaultWidth,
                  defaultColProps,
                })
              )}
            </ProForm>
          )}
          {formType === FormType.STEP && (
            <StepsForm
              {...(formProps as StepsFormProps)}
              onFinish={handleFinish}
            >
              {stepsFieldGroups.map(({ fieldGroups = [], ...item }, index) => (
                <StepsForm.StepForm
                  initialValues={initialValues}
                  {...item}
                  key={index}
                >
                  {fieldGroups.map((group, idx) =>
                    renderFieldGroup(group, idx, {
                      pageOptions,
                      grid: (formProps ?? ({} as any)).grid,
                      defaultWidth,
                      defaultColProps,
                    })
                  )}
                </StepsForm.StepForm>
              ))}
            </StepsForm>
          )}
        </ProCard>
        {children}
      </PageContainer>
    );
  }
);
