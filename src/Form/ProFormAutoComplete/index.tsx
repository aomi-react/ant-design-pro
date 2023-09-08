import React from "react";
import { AutoComplete, AutoCompleteProps } from "antd";
import { ProFieldFCRenderProps } from "@ant-design/pro-provider";
import { createProFormField } from "../createProFormField";

function render(text, props: ProFieldFCRenderProps) {
  return <AutoComplete {...props} {...props.fieldProps} />;
}

/**
 * @deprecated 不推荐使用，使用valueTypeMap映射处理
 */
export const ProFormAutoComplete = createProFormField<AutoCompleteProps>({
  render,
});
