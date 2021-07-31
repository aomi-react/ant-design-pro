import React, { useState } from 'react';
import { Progress } from 'antd';
import { ModalForm } from '@ant-design/pro-form';
import { ProColumns } from '@ant-design/pro-table/lib/typing';

import { ReviewResultText, ReviewStatusText } from '@aomi/common-service/ReviewService/zh-cn';

import { QueryContainer, QueryContainerProps, ActionButtonProps } from '../QueryContainer';
import { ReviewResult } from '@aomi/common-service/ReviewService/ReviewResult';
import { Field, FieldGroup, renderField, renderFieldGroup } from '../PersistContainer';
import { Review } from '@aomi/common-service/ReviewService/Review';
import { ReviewStatus } from '@aomi/common-service/ReviewService/ReviewStatus';

export type ReviewContainerProps<T, U> = {
  /**
   * 审核标题
   */
  reviewTitle?: string;
  onReview?: (formData: any) => Promise<any>;
  /**
   * 审核需要的权限
   */
  reviewAuthorities: Array<string> | boolean;
  /**
   * 自定义展示表格信息
   */
  columns?: ProColumns<T, U>[];

  getColumns?: (defaultColumns: ProColumns<T, U>[]) => ProColumns<T, U>[]

  getReviewFieldGroups?: (review: Review<T>, defaultFields: Array<Field>) => Array<FieldGroup>

} & QueryContainerProps<T, U>;

const COMMON_COLUMNS: Array<ProColumns> = [
  {
    title: '变更说明',
    dataIndex: 'describe',
    search: false
  },
  {
    title: '审核状态',
    dataIndex: 'status',
    valueEnum: ReviewStatusText,
  },
  {
    title: '审核进度',
    dataIndex: 'currentReviewUserIndex',
    renderText: (currentReviewUserIndex, { reviewProcess, status, result }) => {
      let proportion = 100;
      let pstatus: any = 'active';

      if (reviewProcess && reviewProcess.chain) {
        proportion = (currentReviewUserIndex / reviewProcess.chain.length) * 100;
      }

      if (result === ReviewResult.RESOLVE) {
        pstatus = 'success';
      } else if (result === ReviewResult.REJECTED) {
        pstatus = 'exception';
      } else if (status === ReviewStatus.WAIT) {
        pstatus = 'active';
      }

      return <Progress percent={proportion} width={35} type="line" status={pstatus}/>;
    },
    search: false
  },
  {
    title: '当前审核人员或角色',
    dataIndex: 'reviewProcess',
    renderText: (reviewProcess, data) => {
      if (!reviewProcess)
        return '-';
      const { chain } = reviewProcess;
      const item = chain[data.currentReviewUserIndex];
      const { describe, role, user } = (item || {}) as any;

      let result = describe;
      if (role) {
        result = `${result}
      可审核角色: ${role.name}`;
      }
      if (user) {
        result = `${result}
      可审核用户: ${user.name}`;
      }

      return result;
    },
    search: false,
  },
  {
    title: '审核结果',
    dataIndex: 'result',
    valueEnum: ReviewResultText,
  },
  {
    title: '审核结果说明',
    dataIndex: 'resultDescribe',
    search: false,
  },
  {
    title: '创建时间',
    dataIndex: 'createAt',
    valueType: 'dateTime',
    search: false,
  },
  {
    title: '创建时间',
    dataIndex: 'createAtRange',
    valueType: 'dateRange',
    hideInTable: true
  },
];

const defaultFields = [{
  label: '审核结果说明',
  name: 'resultDescribe',
  required: true,
}];

export const ReviewContainer: React.FC<ReviewContainerProps<any, any>> = function ReviewContainer(props) {
  const { reviewAuthorities, reviewTitle = '', onReview, columns = [], getColumns, getReviewFieldGroups, ...args } = props;

  const [state, setState] = useState({
    visible: false,
    result: '',
    id: '',
    review: null
  });

  const table = {
    columns: getColumns ? getColumns(COMMON_COLUMNS) : columns.concat(COMMON_COLUMNS),
  };

  function getActionButtonProps({ selectedRows }): Array<ActionButtonProps> {
    const review = selectedRows[0];
    let disabled = false;
    if (review) {
      if (review.status === 'FINISH') {
        disabled = true;
      }
    } else {
      disabled = true;
    }
    return [
      {
        children: '同意',
        type: 'primary',
        disabled,
        onClick: () => {
          setState({
            visible: true,
            result: ReviewResult.RESOLVE,
            id: selectedRows[0].id,
            review
          });
        },
        authorities: reviewAuthorities,
      },
      {
        children: '拒绝',
        type: 'primary',
        disabled,
        danger: true,
        onClick: () => {
          setState({
            visible: true,
            result: ReviewResult.REJECTED,
            id: selectedRows[0].id,
            review
          });
        },
        authorities: reviewAuthorities,
      },
    ];
  }

  function handleCancel() {
    setState({ ...state, visible: false });
  }

  async function handleOk(formData) {
    if (onReview) {
      await onReview({
        ...formData,
        ...state,
      });
    }
    setState({ visible: false, id: '', result: '', review: null });
  }

  return (
    <QueryContainer table={table} getActionButtonProps={getActionButtonProps} {...args}>
      <ModalForm
        visible={state.visible}
        title={`${reviewTitle ? `${reviewTitle} -` : ''}${ReviewResultText[state.result]}`}
        modalProps={{
          onCancel: handleCancel,
        }}
        onFinish={handleOk}
        submitter={{
          searchConfig: {
            resetText: '取消',
            submitText: ReviewResultText[state.result],
          },
          submitButtonProps: {},
        }}>
        {getReviewFieldGroups ? (getReviewFieldGroups(state.review as any, defaultFields) || []).map((group, index) => renderFieldGroup(group, index)) : defaultFields.map((field, index) => renderField(field, index))}
      </ModalForm>
    </QueryContainer>
  );
};
