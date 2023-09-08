import React from "react";
import { Field } from "../PersistContainer";
import { ProFormField } from "@ant-design/pro-form";

export function renderFormField({
  type = "text",
  valueType,
  fieldProps,
  ...props
}: Field) {
  const vt = valueType || type || "text";
  const newFieldProps = fieldProps ?? {};
  if (vt === "transfer") {
    newFieldProps.transferRender = newFieldProps.render;
  }

  return (
    <ProFormField
      valueType={valueType || type || "text"}
      fieldProps={newFieldProps}
      {...props}
    />
  );
}
