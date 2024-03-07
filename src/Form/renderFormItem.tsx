import React from "react";
import { Field } from "../PersistContainer";
import {
  ProFormField,
  ProFormUploadButton,
  ProFormUploadDragger,
} from "@ant-design/pro-form";

export function renderFormField({
  type = "text",
  valueType,
  fieldProps,
  ...props
}: Field) {
  const vt = valueType || type || "text";
  const newFieldProps = fieldProps ?? {};

  if (vt === "uploadDragger") {
    return (
      <ProFormUploadDragger {...(props as any)} fieldProps={newFieldProps} />
    );
  }
  if (vt === "uploadButton") {
    return (
      <ProFormUploadButton {...(props as any)} fieldProps={newFieldProps} />
    );
  }
  if (vt === "transfer") {
    newFieldProps.transferRender = newFieldProps.render;
  }
  if (props.render) {
    console.warn(
      `[render] is deprecated, please use [renderFormItem] instead.`,
      props
    );
  }

  return <ProFormField valueType={vt} fieldProps={newFieldProps} {...props} />;
}
