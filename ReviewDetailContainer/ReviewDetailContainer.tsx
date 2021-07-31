import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import { PageContainer, PageContainerProps } from '@ant-design/pro-layout';
import ProDescriptions, { ProDescriptionsProps } from '@ant-design/pro-descriptions';
import ProCard, { ProCardTabsProps } from '@ant-design/pro-card';

import { Button, Col, Row, Steps, Typography } from 'antd';
import { ObjectUtils } from '@aomi/utils/ObjectUtils';
import { MomentDateUtil } from '@aomi/utils/MomentDateUtil';
import { MehOutlined, SmileOutlined } from '@ant-design/icons';
import Common from '@aomi/common-service/constants/Common';
import { ReviewResult } from '@aomi/common-service/ReviewService/ReviewResult';
import { ReviewResultText, ReviewStatusText } from '@aomi/common-service/ReviewService/zh-cn';
import { ReviewStatus } from '@aomi/common-service/ReviewService/ReviewStatus';
import { Review } from '@aomi/common-service/ReviewService/Review';
import { navigationServices } from '@aomi/mobx-history';
import { ProCardTabPaneProps } from '@ant-design/pro-card/es/type';
import { ModalForm } from '@ant-design/pro-form';
import { hasAuthorities } from '@aomi/utils/hasAuthorities';
import { ReviewHistory } from '@aomi/common-service/ReviewService/ReviewHistory';
import { Field, FieldGroup, renderField, renderFieldGroup } from '../PersistContainer';
import { defaultFields } from '../ReviewContainer/ReviewContainer';

export type TabPaneProps = {
  tabPaneProps: ProCardTabPaneProps
  descriptionsProps?: Omit<ProDescriptionsProps, 'columns'>,
  columnGroups: Array<ProDescriptionsProps>
}

export type ReviewDetailContainerProps<T> = {
  /**
   * 页面容器props
   */
  container?: PageContainerProps

  /**
   * 是否是从查询页面跳转到该页面
   * 默认为true
   */
  fromQueryContainer?: boolean

  /**
   * 以tab形式展示数据
   */
  tabs?: ProCardTabsProps
  /**
   * 初始化激活的tab
   */
  tabActiveKey: string

  getTabPaneProps: (review: Review<T>) => Array<TabPaneProps>

  /**
   * 审核需需要的权限
   */
  authorities?: Array<string>

  /**
   * 处理审核
   * @param reviewHistory
   */
  onReview?: (reviewHistory: ReviewHistory & { id: string }) => Promise<void>

  location?: Location

  review?: Review<T>

  getReviewFieldGroups?: (review: Review<T>, defaultFields: Array<Field>) => Array<FieldGroup>
}


function renderHeader<T>({ describe, histories, reviewProcess, result, status }: Review<T>) {

  const first = histories[0];

  const { chain = [] } = reviewProcess || {};

  return (
    <>
      {/*{renderDescriptions(headerDescriptions)}*/}
      <Steps>
        <Steps.Step status="finish"
                    title={describe}
                    description={
                      <div style={{ fontSize: 12 }}>
                        <div>{ObjectUtils.getValue(first, 'user.name')}</div>
                        <div>{first.describe}</div>
                        <div>{MomentDateUtil.format(first.reviewAt, Common.DATETIME_FORMAT)}</div>
                      </div>
                    }

        />
        {chain.map(({ describe, roleName, userName }, index) => {
          const h = histories.length > index + 1 ? histories[index + 1] : null;
          let d, s;
          if (h) {
            s = h.result === ReviewResult.RESOLVE ? 'finish' : 'error';
            d = (
              <div style={{ fontSize: 12 }}>
                <div>{ObjectUtils.getValue(h, 'user.name')}</div>
                <div>{`${ReviewResultText[h.result]}原因: ${h.describe}`}</div>
                <div>{MomentDateUtil.format(h.reviewAt, Common.DATETIME_FORMAT)}</div>
              </div>
            );
          } else {
            s = result === ReviewResult.REJECTED ? 'error' : 'wait';
            d = [roleName, userName].join('/');
          }
          return (
            <Steps.Step status={s}
                        title={describe}
                        description={d}
                        key={index}
            />
          );
        })}
        <Steps.Step status={status === ReviewStatus.FINISH ? (result === ReviewResult.RESOLVE ? 'finish' : 'error') : 'wait'}
                    title={ReviewStatusText.FINISH}
                    icon={result === ReviewResult.REJECTED ? <MehOutlined/> : <SmileOutlined/>}
        />
      </Steps>
    </>
  );
}


/**
 * 审核详情页面
 */
export const ReviewDetailContainer: React.FC<ReviewDetailContainerProps<any>> = observer(withRouter(function ReviewDetailContainer(inProps) {
  const {
    container,

    review,
    onReview,

    tabs,
    tabActiveKey: initTabActiveKey,
    getTabPaneProps,

    authorities,
    fromQueryContainer = true,

    location = {},
    children,
    getReviewFieldGroups
  } = inProps;

  const [tabActiveKey, setTabActiveKey] = useState(initTabActiveKey);
  const [visible, setVisible] = useState(false);
  const [result, setResult] = useState('');

  let reviewData: Review<any>;

  if (fromQueryContainer) {
    const { selectedRows = [] } = location.params || {};
    reviewData = selectedRows[0];
  } else {
    reviewData = review;
  }

  useEffect(() => {
    if (!reviewData) {
      console.warn('没有发现详情数据.自动返回上一页');
      navigationServices.goBack();
    }
  }, []);

  if (!reviewData) {
    return <div/>;
  }


  const { id, before, after, status } = reviewData;

  async function handleReview(formData) {
    onReview && await onReview({
      ...formData,
      id,
      result,
    });
  }

  const extra: any = [];
  if (hasAuthorities(authorities) && status !== ReviewStatus.FINISH) {
    extra.push(
      <Button key="0"
              danger
              type="primary"
              onClick={() => {
                setVisible(true);
                setResult(ReviewResult.REJECTED);
              }}
      >
        {ReviewResultText.REJECTED}
      </Button>,
      <Button key="1"
              type="primary"
              onClick={() => {
                setVisible(true);
                setResult(ReviewResult.RESOLVE);
              }}
      >
        {ReviewResultText.RESOLVE}
      </Button>
    );
  }


  const newTabs: ProCardTabsProps = {
    tabPosition: 'top',
    ...tabs,
    activeKey: tabActiveKey,
    onChange: setTabActiveKey,
  };

  const tabPanes: Array<TabPaneProps> = getTabPaneProps(review);

  return (
    <PageContainer subTitle={reviewData.describe} extra={extra} content={renderHeader(reviewData)} {...container} >
      <ProCard tabs={newTabs}>
        {tabPanes.map(({ tabPaneProps, descriptionsProps, columnGroups }, idx) => (
          <ProCard.TabPane {...tabPaneProps}>
            <Row gutter={30}>
              <Col span={12}>
                {before && <Typography.Title level={4}>{'变更前'}</Typography.Title>}
                {before && columnGroups.map((item, index) => (
                  <ProDescriptions column={2} dataSource={before} {...descriptionsProps} key={index} {...item} editable={undefined}/>
                ))}
              </Col>
              <Col span={before ? 12 : 24}>
                <Typography.Title level={4}>{'变更后'}</Typography.Title>
                {after && columnGroups.map((item, index) => (
                  <ProDescriptions column={before ? 2 : 4} dataSource={after} {...descriptionsProps} key={index} {...item}/>
                ))}
              </Col>
            </Row>
          </ProCard.TabPane>
        ))}
      </ProCard>
      {children}
      <ModalForm visible={visible}
                 title={`执行审核 - ${ReviewResultText[result]}`}

                 modalProps={{
                   onCancel: () => setVisible(false),
                 }}
                 onFinish={handleReview}
                 submitter={{
                   searchConfig: {
                     submitText: ReviewResultText[result],
                   }
                 }}
      >
        {getReviewFieldGroups ? (getReviewFieldGroups(reviewData, defaultFields) || []).map((group, index) => renderFieldGroup(group, index)) : defaultFields.map((field, index) => renderField(field, index))}
      </ModalForm>
    </PageContainer>
  );
}));
