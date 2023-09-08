import React from "react";
import { ProFieldFCRenderProps } from "@ant-design/pro-provider";
import { createProFormField } from "../createProFormField";
import { Transfer, TransferProps } from "antd";

function render(text, props: ProFieldFCRenderProps) {
  return <Transfer {...props} {...props.fieldProps} targetKeys={props.value} />;
}

/**
 * @deprecated 不推荐使用，使用valueTypeMap映射处理
 */
export const ProFormTransfer = createProFormField<TransferProps<any>>({
  render,
});
