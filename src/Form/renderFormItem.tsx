import React from "react";
import { Field } from "../PersistContainer";
import {
  ProFormCaptcha,
  ProFormCascader,
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDateTimePicker,
  ProFormDateTimeRangePicker,
  ProFormDigit,
  ProFormField,
  ProFormMoney,
  ProFormRadio,
  ProFormRate,
  ProFormSegmented,
  ProFormSelect,
  ProFormSlider,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProFormTimePicker,
  ProFormTreeSelect,
  ProFormUploadButton,
  ProFormUploadDragger,
} from "@ant-design/pro-form";
import { ProFormAutoComplete } from "./ProFormAutoComplete";
import { ProFormTransfer } from "./ProFormTransfer";

/**
 * @param props
 * @deprecated 请直接使用原生组件
 */
export function renderText(props) {
  return <ProFormText {...props} />;
}

/**
 * @param props
 * @deprecated 请直接使用原生组件
 */
export function renderPassword(props) {
  return <ProFormText.Password {...props} />;
}

/**
 * @param props
 * @deprecated 请直接使用原生组件
 */
export function renderCaptcha(props) {
  return <ProFormCaptcha {...props} />;
}

/**
 * @param props
 * @deprecated 请直接使用原生组件
 */
export function renderDatePicker(props) {
  return <ProFormDatePicker {...props} />;
}

/**
 * @param props
 * @deprecated 请直接使用原生组件
 */
export function renderDateTimePicker(props) {
  return <ProFormDateTimePicker {...props} />;
}

/**
 * @param props
 * @deprecated 请直接使用原生组件
 */
export function renderDateRangePicker(props) {
  return <ProFormDateRangePicker {...props} />;
}

/**
 * @param props
 * @deprecated 请直接使用原生组件
 */
export function renderDateTimeRangePicker(props) {
  return <ProFormDateTimeRangePicker {...props} />;
}

/**
 * @param props
 * @deprecated 请直接使用原生组件
 */
export function renderTimePicker(props) {
  return <ProFormTimePicker {...props} />;
}

/**
 * @param props
 * @deprecated 请直接使用原生组件
 */
export function renderTimeRangePicker(props) {
  return <ProFormTimePicker.RangePicker {...props} />;
}

/**
 * @param props
 * @deprecated 请直接使用原生组件
 */
export function renderTextArea(props) {
  return <ProFormTextArea {...props} />;
}

/**
 * @param props
 * @deprecated 请直接使用原生组件
 */
export function renderCheckbox(props) {
  return <ProFormCheckbox {...props} />;
}

/**
 * @param props
 * @deprecated 请直接使用原生组件
 */
export function renderRadioGroup(props) {
  return <ProFormRadio.Group {...props} />;
}

/**
 * @param props
 * @deprecated 请直接使用原生组件
 */
export function renderSwitch(props) {
  return <ProFormSwitch {...props} />;
}

/**
 * @param props
 * @deprecated 请直接使用原生组件
 */
export function renderRate(props) {
  return <ProFormRate {...props} />;
}

/**
 * @param props
 * @deprecated 请直接使用原生组件
 */
export function renderSlider(props) {
  return <ProFormSlider {...props} />;
}

/**
 * @param props
 * @deprecated 请直接使用原生组件
 */
export function renderUploadDragger(props) {
  return <ProFormUploadDragger {...props} />;
}

/**
 * @param props
 * @deprecated 请直接使用原生组件
 */
export function renderUploadButton(props) {
  return <ProFormUploadButton {...props} />;
}

/**
 * 渲染 select
 * @param options select option 支持对象，对象的key作为 option value，对象value作为option label
 * @param props
 * @deprecated 请直接使用原生组件
 */
export function renderSelect({ fieldProps = {}, ...props }: any) {
  const newFieldProps = {
    ...fieldProps,
  };

  return <ProFormSelect fieldProps={newFieldProps} {...props} />;
}

/**
 * @param props
 * @deprecated 请直接使用原生组件
 */
export function renderTreeSelect({ fieldProps = {}, ...props }: any) {
  const newFieldProps = {
    ...fieldProps,
  };

  return <ProFormTreeSelect fieldProps={newFieldProps} {...props} />;
}

/**
 * @param props
 * @deprecated 请直接使用原生组件
 */
export function renderDigit(props) {
  return <ProFormDigit {...props} />;
}

/**
 * @param props
 * @deprecated 请直接使用原生组件
 */
export function renderMoney(props) {
  return <ProFormMoney {...props} />;
}

/**
 * @param props
 * @deprecated 请直接使用原生组件
 */
export function renderAutoComplete({ fieldProps = {}, ...props }: any) {
  const newFieldProps = {
    ...fieldProps,
  };

  return <ProFormAutoComplete {...props} fieldProps={newFieldProps} />;
}

/**
 * @param props
 * @deprecated 请直接使用原生组件
 */
export function renderCascader({ fieldProps = {}, ...props }: any) {
  const newFieldProps = {
    ...fieldProps,
  };

  return <ProFormCascader {...props} fieldProps={newFieldProps} />;
}

/**
 * @param props
 * @deprecated 请直接使用原生组件
 */
export function renderTransfer(props) {
  return <ProFormTransfer {...props} />;
}

/**
 * @param props
 * @deprecated 请直接使用原生组件
 */
export function renderSegmented(props) {
  return <ProFormSegmented {...props} />;
}

export function renderFormField({ type = "text", valueType, ...props }: Field) {
  return <ProFormField valueType={valueType || type || "text"} {...props} />;

  // let element: ReactNode = undefined;
  // if (proFormFieldProps) {
  //   // const ProFormCustom = createProFormField<any>({render});
  //   // return (
  //   //   <ProFormCustom {...props}/>
  //   // );
  //   return <ProFormField {...props} {...proFormFieldProps} />;
  // }
  // switch (type) {
  //   case "text":
  //     element = renderText(props);
  //     break;
  //   case "password":
  //     element = renderPassword(props);
  //     break;
  //   case "captcha":
  //     element = renderCaptcha(props);
  //     break;
  //   case "datePicker":
  //     element = renderDatePicker(props);
  //     break;
  //   case "dateTimePicker":
  //     element = renderDateTimePicker(props);
  //     break;
  //   case "dateRangePicker":
  //     element = renderDateRangePicker(props);
  //     break;
  //   case "dateTimeRangePicker":
  //     element = renderDateTimeRangePicker(props);
  //     break;
  //   case "timePicker":
  //     element = renderTimePicker(props);
  //     break;
  //   case "timeRangePicker":
  //     element = renderTimeRangePicker(props);
  //     break;
  //   case "textArea":
  //     element = renderTextArea(props);
  //     break;
  //   case "checkbox":
  //     element = renderCheckbox(props);
  //     break;
  //   case "radioGroup":
  //     element = renderRadioGroup(props);
  //     break;
  //   case "switch":
  //     element = renderSwitch(props);
  //     break;
  //   case "rate":
  //     element = renderRate(props);
  //     break;
  //   case "slider":
  //     element = renderSlider(props);
  //     break;
  //   case "uploadDragger":
  //     element = renderUploadDragger(props);
  //     break;
  //   case "uploadButton":
  //     element = renderUploadButton(props);
  //     break;
  //   case "select":
  //     element = renderSelect(props);
  //     break;
  //   case "treeSelect":
  //     element = renderTreeSelect(props);
  //     break;
  //   case "digit":
  //     element = renderDigit(props);
  //     break;
  //   case "money":
  //     element = renderMoney(props);
  //     break;
  //   case "autoComplete":
  //     element = renderAutoComplete(props);
  //     break;
  //   case "cascader":
  //     element = renderCascader(props);
  //     break;
  //   case "transfer":
  //     element = renderTransfer(props);
  //     break;
  //   case "segmented":
  //     element = renderSegmented(props);
  //     break;
  // }
  // return element;
}
