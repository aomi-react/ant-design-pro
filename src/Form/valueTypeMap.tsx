import React from "react";
import { ProRenderFieldPropsType } from "@ant-design/pro-provider";
import { AutoComplete, Transfer } from "antd";

/**
 * 值类型映射到对应的渲染组件
 */
export const valueTypeMap: Record<string, ProRenderFieldPropsType> = {
  autoComplete: {
    renderFormItem(text, props) {
      return <AutoComplete {...props} {...props.fieldProps} />;
    },
  },
  transfer: {
    renderFormItem(text, props) {
      return (
        <Transfer {...props} {...props.fieldProps} targetKeys={props.value} />
      );
    },
  },
};
