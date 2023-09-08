import React from "react";
import { Field } from "../PersistContainer";
import { ProFormField } from "@ant-design/pro-form";

export function renderFormField({ type = "text", valueType, ...props }: Field) {
  return <ProFormField valueType={valueType || type || "text"} {...props} />;
}
