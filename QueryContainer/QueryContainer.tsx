import React, { forwardRef, ReactElement, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { PageContainer, PageContainerProps } from '@ant-design/pro-layout';
import ProTable, { ProTableProps } from '@ant-design/pro-table';
import { ParamsType } from '@ant-design/pro-provider';
import { BaseService } from '@aomi/common-service/BaseService';
import { ObjectUtils } from '@aomi/utils/ObjectUtils';
import { Button, ButtonProps, FormInstance, Modal, TablePaginationConfig } from 'antd';
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { navigationServices } from '@aomi/react-router/Navigation';
import { TableRowSelection } from '@ant-design/pro-table/es/typing';
import { hasAuthorities } from '@aomi/utils/hasAuthorities';
import { Stats } from './Stats';
import ProDescriptions, { ProDescriptionsProps } from '@ant-design/pro-descriptions';

export interface QueryContainerState<T> {
  selectedRowKeys: Array<string>;
  selectedRows: Array<T>;
}

export type ActionButtonProps = ButtonProps & {
  authorities?: string | Array<string> | boolean
}

export interface QueryContainerProps<T, U extends ParamsType> {
  addAuthorities?: Array<string> | string;
  editAuthorities?: Array<string> | string;
  delAuthorities?: Array<string> | string;


  /**
   * 新增按钮点击
   * @param state 当前页面state
   */
  onAdd?: (state: QueryContainerState<T>) => void;
  /**
   * 编辑按钮点击
   * @param state 当前页面state
   */
  onEdit?: (state: QueryContainerState<T>) => void;
  /**
   * 删除按钮页面点击.
   * 当存在该值时,service中的del方法不会执行。否则执行service中的del方法
   * @param keys 当前选择的数据keys
   * @param state 当前页面state
   */
  onDel?: (keys: string | Array<string>, state: QueryContainerState<T>, handleResetRowKeys: () => void) => void;

  /**
   * 新增页面uri
   */
  addUri?: string;

  /**
   * 编辑页面uri
   */
  editUri?: string;

  /**
   * 用户判断编辑按钮是否禁用
   * @param state 当前页面状态
   */
  editDisabled?: (state: QueryContainerState<T>) => boolean;

  /**
   * 详情页面uri
   */
  detailUri?: string;

  /**
   * 详情按钮点击
   * @param state 当前页面state
   */
  onDetail?: (state: QueryContainerState<T>) => void;

  /**
   * 详情显示属性,在column中显示详情按钮
   */
  detailProps?: Array<ProDescriptionsProps> | ((record) => Array<ProDescriptionsProps>);

  /**
   * 渲染动作组按钮
   * 组件当前State值
   * @param state
   * @deprecated 请使用{@link getActionButtonProps}
   */
  renderActionButtons?: (state: QueryContainerState<T>) => Array<ReactElement>;
  /**
   * 获取按钮组件的props
   * @param state 页面状态参数
   */
  getActionButtonProps?: (state: QueryContainerState<T>) => Array<ActionButtonProps>;

  container?: PageContainerProps;

  table?: ProTableProps<T, U>;

  service?: BaseService<T>;

  showStats?: boolean;
  statsColumns?: ProDescriptionsProps['columns'];
  statsProps?: ProDescriptionsProps;
}

function handleDetail(state, onDetail, detailUri) {
  if (detailUri) {
    navigationServices.push(detailUri, {
      state
    });
    return;
  }
  onDetail && onDetail(state);
}

function handleAdd(state, onAdd, addUri) {
  if (addUri) {
    navigationServices.push(addUri, { state });
    return;
  }
  onAdd && onAdd(state);
}

function handleEdit(state, onEdit, editUri) {
  if (editUri) {
    navigationServices.push(editUri, { state });
    return;
  }
  onEdit && onEdit(state);
}

function handleDel(state, onDel, service: BaseService<any>, setSelectedRows, setSelectedRowKeys) {
  const { selectedRowKeys } = state;
  const keys = selectedRowKeys.length === 1 ? selectedRowKeys[0] : selectedRowKeys;

  function handleResetRowKeys() {
    setSelectedRows([]);
    setSelectedRowKeys([]);
  }

  if (onDel) {
    onDel(keys, state, handleResetRowKeys);
  } else if (service) {
    service.del(keys, { state, resetSelectedRows: handleResetRowKeys });
  }
}

function getActionButtons({
                            selectedRows,
                            setSelectedRows,
                            selectedRowKeys,
                            setSelectedRowKeys,
                            onDetail, detailUri,
                            onAdd, addUri, addAuthorities,
                            onEdit, editUri, editAuthorities, editDisabled,
                            onDel, delAuthorities,
                            service,
                            renderActionButtons,
                            getActionButtonProps
                          }) {
  const state = { selectedRows, selectedRowKeys };
  const newActionButtons: Array<React.ReactNode> = [];
  if (renderActionButtons) {
    console.warn(`[Aomi React Pro Ant Design] renderActionButtons 方法已经过时,请使用 getActionButtonProps`);
    newActionButtons.push(...renderActionButtons(state));
  }

  const buttonProps: Array<ActionButtonProps> = [];
  getActionButtonProps && buttonProps.push(...getActionButtonProps(state));

  (onDetail || detailUri) && buttonProps.push({
    type: 'primary',
    disabled: selectedRowKeys.length !== 1,
    onClick: () => handleDetail(state, onDetail, detailUri),
    children: (
      <>
        <InfoCircleOutlined/> {'详情'}
      </>
    )
  });

  (onAdd || addUri) && buttonProps.push({
    authorities: addAuthorities,
    type: 'primary',
    onClick: () => handleAdd(state, onAdd, addUri),
    children: (
      <>
        <PlusOutlined/> {'新增'}
      </>
    )
  });

  (onEdit || editUri) && buttonProps.push({
    authorities: editAuthorities,
    disabled: editDisabled ? editDisabled(state) : selectedRowKeys.length !== 1,
    type: 'primary',
    onClick: () => handleEdit(state, onEdit, editUri),
    children: (
      <>
        <EditOutlined/> {'编辑'}
      </>
    )
  });

  onDel && buttonProps.push({
    authorities: delAuthorities,
    danger: true,
    onClick: () => handleDel(state, onDel, service, setSelectedRows, setSelectedRowKeys),
    disabled: selectedRowKeys.length <= 0,
    children: (
      <>
        <DeleteOutlined/> {'删除'}
      </>
    )
  });

  return newActionButtons.concat(
    buttonProps.filter(item => item.authorities ? hasAuthorities(item.authorities) : true).map(({ authorities, ...item }, idx) => (
      <Button key={idx} {...item}/>
    ))
  );
}

export const QueryContainer: React.FC<QueryContainerProps<any, any>> = observer(forwardRef<any, React.PropsWithChildren<QueryContainerProps<any, any>>>(function QueryContainer(inProps, ref) {
    const {
      onDetail, detailUri,
      onAdd, addUri, addAuthorities,
      onEdit, editUri, editAuthorities, editDisabled,
      onDel, delAuthorities,
      renderActionButtons, getActionButtonProps,


      container,
      table,
      service,

      showStats = true,
      statsColumns,
      statsProps,

      detailProps,

      children
    } = inProps;

    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [detailModalProps, setDetailModalProps] = useState({ visible: false, record: {} });

    const form = useRef<FormInstance>();

    const { loading, page } = service || {};

    const { rowSelection, pagination, search = {}, options, toolbar, columns = [], ...other } = table || {};

    const newRowSelection: TableRowSelection = {
      type: 'radio',
      ...rowSelection,
      onChange: handleRowSelected
    };

    const newPagination: TablePaginationConfig = {
      showQuickJumper: true,
      showSizeChanger: true,
      defaultCurrent: 1,
      defaultPageSize: 10,
      size: 'small',
      pageSizeOptions: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100', '500', '1000'],
      hideOnSinglePage: false,
      ...pagination
    };

    const tableProps: ProTableProps<any, any> = ObjectUtils.deepmerge(other, {
      columns,
      form: {
        submitter: {
          submitButtonProps: {
            loading
          },
          resetButtonProps: {
            loading
          }
        }
      }
    });
    if (detailProps) {
      tableProps.columns = [...columns, {
        title: ' ',
        valueType: 'option',
        fixed: 'right',
        render: (text, record, _) => [
          <a
            key="detail"
            onClick={() => setDetailModalProps({ visible: true, record })}>
            {'详情'}
          </a>
        ]
      }];
    }
    if (showStats) {
      tableProps.tableExtraRender = () => <Stats dataSource={{ ...page, ...(page as any)?.value }} columns={statsColumns} {...statsProps}/>;
    }

    // search
    const newSearch = {
      defaultCollapsed: false,
      ...search
    };


    function handleRowSelected(selectedRowKeys, selectedRows) {
      setSelectedRows(selectedRows);
      setSelectedRowKeys(selectedRowKeys);

      if (rowSelection && rowSelection.onChange) {
        rowSelection.onChange(selectedRows, selectedRows);
      }
    }

    async function handleSearch(params: { pageSize: number; current: number; } & any, sort?, filter?) {
      console.log('查询查询', params, sort, filter);
      if (service) {
        await service.query({
          pageSize: newPagination.defaultPageSize,
          current: newPagination.defaultCurrent,
          ...params,
          page: params.current - 1,
          size: params.pageSize
        });
        const { page } = service;
        return {
          data: page.content,
          success: true,
          total: page.totalElements
        };
      }

      return {
        data: [],
        success: true,
        total: 0
      };
    }


    async function handleReset() {
      const value = form.current?.getFieldsValue();
      await handleSearch({ pageSize: newPagination.defaultPageSize, current: newPagination.defaultCurrent, ...value });
    }

    async function handleReload() {
      if (service) {
        await handleSearch(service.searchParams || {});
      }
    }

    return (
      <PageContainer style={{ whiteSpace: 'nowrap' }}
                     onBack={navigationServices.back}
                     {...container}
      >
        <ProTable rowKey="id"
                  size="small"
                  bordered
                  dateFormatter={false}
                  scroll={{
                    x: true,
                    scrollToFirstRowOnChange: true
                  }}
                  formRef={form}
                  dataSource={page?.content}
                  loading={loading}
                  request={handleSearch}
                  onReset={handleReset}
                  pagination={newPagination}
                  options={{ fullScreen: true, reload: handleReload, ...options }}
                  search={newSearch}
                  rowSelection={newRowSelection}
                  toolbar={{
                    actions: getActionButtons({
                      selectedRows, setSelectedRows, selectedRowKeys, setSelectedRowKeys,
                      onDetail, detailUri,
                      onAdd, addUri, addAuthorities,
                      onEdit, editUri, editAuthorities, editDisabled,
                      onDel, delAuthorities,
                      service,
                      renderActionButtons,
                      getActionButtonProps
                    }),
                    ...toolbar
                  }}
                  {...tableProps}
        />
        <Modal visible={detailModalProps.visible} onCancel={() => setDetailModalProps({ visible: false, record: {} })}
               width="80%"
        >
          {(typeof detailProps === 'function' ? detailProps(detailModalProps.record) : detailProps)?.map((item, index) => (
            <ProDescriptions dataSource={detailModalProps.record} column={4} {...item}
                             key={index}/>
          ))}
        </Modal>
        {children}
      </PageContainer>
    );
  }
));
