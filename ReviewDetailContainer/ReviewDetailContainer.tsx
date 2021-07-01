import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import { PageContainer, PageContainerProps } from '@ant-design/pro-layout';
import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProCard, { ProCardTabsProps } from '@ant-design/pro-card';

import { Col, Row, Steps } from 'antd';
import { ObjectUtils } from '@aomi/utils/ObjectUtils';
import { MomentDateUtil } from '@aomi/utils/MomentDateUtil';
import { MehOutlined, SmileOutlined } from '@ant-design/icons';
import Common from '@aomi/common-service/constants/Common';
import { ReviewResult } from '@aomi/common-service/ReviewService/ReviewResult';
import { ReviewResultText, ReviewStatusText } from '@aomi/common-service/ReviewService/zh-cn';
import { ReviewStatus } from '@aomi/common-service/ReviewService/ReviewStatus';
import { Review } from '@aomi/common-service/ReviewService/Review';
import { navigationServices } from '@aomi/mobx-history';

export type ReviewDetailContainerProps<T> = {
  /**
   * 页面容器props
   */
  container?: PageContainerProps

  /**
   * 详情列信息定义
   */
  columns?: ProDescriptionsItemProps<any, any>[];

  /**
   * 是否是从查询页面跳转到该页面
   * 默认为true
   */
  fromQueryContainer?: boolean

  location?: Location

  review?: Review<T>
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
export const ReviewDetailContainer: React.FC<ReviewDetailContainerProps<any>> = observer(withRouter(function DetailContainer(inProps) {
  const {
    container,

    review,

    columns,

    fromQueryContainer = true,

    location = {},
    children
  } = inProps;

  const [tabActiveKey, setTabActiveKey] = useState('base');

  let reviewData: Review<any>;

  if (fromQueryContainer) {
    const { selectedRows = [] } = location.params || {};
    reviewData = selectedRows[0];
  } else {
    reviewData = review;
  }

  if (!reviewData) {
    console.warn('没有发现详情数据.自动返回上一页');
    navigationServices.goBack();
  }

  const { before, after } = reviewData;

  const tabs: ProCardTabsProps = {
    tabPosition: 'top',
    activeKey: tabActiveKey,
    onChange: setTabActiveKey,
  };

  return (
    <PageContainer subTitle={review.describe} content={renderHeader(reviewData)} {...container} >
      <ProCard tabs={tabs}>
        <Row gutter={30}>
          <Col span={12}>
            {before && (
              <ProDescriptions title="变更前" columns={columns} dataSource={before}/>
            )}
          </Col>
          <Col span={before ? 12 : 24}>
            {after && (
              <ProDescriptions title="变更后" columns={columns} dataSource={before}/>
            )}
          </Col>
        </Row>
      </ProCard>
      {children}
    </PageContainer>
  );
}));
