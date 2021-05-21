import React, { forwardRef, ReactElement, useState } from 'react';
import { observer } from 'mobx-react';
import { PageContainer, PageContainerProps } from '@ant-design/pro-layout';
import ProTable, { ProTableProps } from '@ant-design/pro-table';
import { ParamsType } from '@ant-design/pro-provider';
import { BaseService } from '@aomi/common-service/BaseService';
import { ObjectUtils } from '@aomi/utils/ObjectUtils';
import { hasAuthorities } from '@aomi/utils/hasAuthorities';
import { Button, TablePaginationConfig } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { navigationServices } from '@aomi/mobx-history';
import { DEFAULT_PAGE } from '@aomi/common-service/Page';
import { TableRowSelection } from '@ant-design/pro-table/es/typing';

export interface QueryContainerState<T> {
  selectedRowKeys: Array<string>
  selectedRows: Array<T>
}

export interface QueryContainerProps<T, U extends ParamsType> {
  addAuthorities?: Array<string> | string
  editAuthorities?: Array<string> | string
  delAuthorities?: Array<string> | string

  /**
   * 新增按钮点击
   * @param state 当前页面state
   */
  onAdd?: (state: QueryContainerState<T>) => void
  /**
   * 编辑按钮点击
   * @param state 当前页面state
   */
  onEdit?: (state: QueryContainerState<T>) => void
  /**
   * 删除按钮页面点击.
   * 当存在该值时,service中的del方法不会执行。否则执行service中的del方法
   * @param keys 当前选择的数据keys
   * @param state 当前页面state
   */
  onDel?: (keys: string | Array<string>, state: QueryContainerState<T>, handleResetRowKeys: () => void) => void

  /**
   * 新增页面uri
   */
  addUri?: string

  /**
   * 编辑页面uri
   */
  editUri?: string

  /**
   * 详情页面uri
   */
  detailUri?: string

  /**
   * 渲染动作组按钮
   * 组件当前State值
   * @param state
   */
  renderActionButtons?: (state: QueryContainerState<T>) => Array<ReactElement>

  container?: PageContainerProps

  table?: ProTableProps<T, U>

  service?: BaseService<T>
}

function handleAdd(state, onAdd, addUri) {
  if (addUri) {
    navigationServices.push({
      pathname: addUri,
      params: state
    });
    return;
  }
  onAdd && onAdd(state);
}

function handleEdit(state, onEdit, editUri) {

  if (editUri) {
    navigationServices.push({
      pathname: editUri,
      params: state
    });
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
                            onAdd, addUri, addAuthorities,
                            onEdit, editUri, editAuthorities,
                            onDel, delAuthorities,
                            service,
                            renderActionButtons
                          }) {
  const state = { selectedRows, selectedRowKeys };
  const newActionButtons: Array<React.ReactNode> = [];
  renderActionButtons && newActionButtons.push(...renderActionButtons(state));
  if ((onAdd || addUri) && hasAuthorities(addAuthorities)) {
    newActionButtons.push(
      <Button key="add" type="primary" onClick={() => handleAdd(state, onAdd, addUri)}>
        <PlusOutlined/> {'新增'}
      </Button>
    );
  }
  if ((onEdit || editUri) && hasAuthorities(editAuthorities)) {
    const disabled = selectedRowKeys.length !== 1;
    newActionButtons.push(
      <Button key="edit" type="primary" onClick={() => handleEdit(state, onEdit, editUri)} disabled={disabled}>
        <EditOutlined/> {'编辑'}
      </Button>
    );
  }
  if (onDel && hasAuthorities(delAuthorities)) {
    const disabled = selectedRowKeys.length <= 0;
    newActionButtons.push(
      <Button key="del" danger onClick={() => handleDel(state, onDel, service, setSelectedRows, setSelectedRowKeys)} disabled={disabled}>
        <DeleteOutlined/> {'删除'}
      </Button>
    );
  }
  return newActionButtons;
}

export const QueryContainer = observer(forwardRef<any, React.PropsWithChildren<QueryContainerProps<any, any>>>(function QueryContainer(inProps, ref) {
  const {
    onAdd, addUri, addAuthorities, onEdit, editUri, editAuthorities, onDel, delAuthorities, renderActionButtons,


    container,
    table,
    service
  } = inProps;

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);


  const { loading, page } = service || {};

  const { content, number = 0, size = 10, totalElements = 0 } = page || DEFAULT_PAGE;

  const { rowSelection, pagination, search = {}, options, ...other } = table || {};

  const newRowSelection: TableRowSelection = {
    type: 'radio',
    ...rowSelection,
    onChange: handleRowSelected
  };

  const newPagination: TablePaginationConfig = {
    current: number + 1,
    total: totalElements,
    pageSize: size,
    showQuickJumper: true,
    showSizeChanger: true,
    defaultPageSize: 10,
    size: 'small',
    pageSizeOptions: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100', '500', '1000'],
    onChange: handlePageChange,
    onShowSizeChange: handlePageChange,
    hideOnSinglePage: false,
    ...pagination
  };

  const tableProps = ObjectUtils.deepmerge(other, {
    form: {
      submitter: {
        submitButtonProps: {
          loading,
        },
      },
    },
  });

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

  async function handlePageChange(page, size) {
    console.log(`next page -> ${page - 1}, next page size -> ${size}`);
    if (service) {
      const { query, searchParams } = service;
      await query({
        ...searchParams,
        page: page - 1,
        size
      });
    }
  }


  function handleSearch(params) {
    if (service) {
      service.query(params);
    }
  }


  function handleReset() {
    handleSearch({});
  }

  function handleReload() {
    if (service) {
      handleSearch(service.searchParams || {});
    }
  }

  return (
    <PageContainer style={{ whiteSpace: 'nowrap' }}
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
                loading={loading}
                dataSource={content}
                onSubmit={handleSearch}
                onReset={handleReset}
                pagination={newPagination}
                options={{ ...options, reload: handleReload }}
                search={newSearch}
                rowSelection={newRowSelection}
                toolBarRender={() => getActionButtons({
                  selectedRows, setSelectedRows, selectedRowKeys, setSelectedRowKeys,
                  onAdd, addUri, addAuthorities,
                  onEdit, editUri, editAuthorities,
                  onDel, delAuthorities,
                  service,
                  renderActionButtons
                })}
                {...tableProps}
      />
    </PageContainer>
  );
}));
