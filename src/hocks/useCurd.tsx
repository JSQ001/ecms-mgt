import { ref, reactive, computed, toRaw, onMounted, watch, watchEffect } from 'vue'
import { message, Modal } from 'ant-design-vue'
import BaseApi, { BaseApiProps } from '@/hocks/useApi'
import useApi from '@/hocks/useApi'

type StateProps = {
  searchParams: Object
  dataSource: []
  record: Object
  visible: Boolean
  isEdit: Boolean
  loading: Boolean
  confirmLoading: Boolean
  handleCreateClick: Function
  handleEditClick: Function
  save: Function
  query: Function
  reset: Function
  reload: Function
  deleteFunc: Function
  batchDelFunc: Function
  selectedRowKeys: any[]
  selectedRows: any[]
  onSelectChange?: Function
  pagination?: any
}

type CurdProps = {
  baseApi: BaseApiProps
  readonly renderSaveData?: Function
  readonly refresh?: Function
  readonly pageSize?: number
  readonly renderData?: Function
  readonly noInitQuery?: boolean
  readonly paginationNoSearch?: boolean
  searchParams?: any
  pageField?: string
  pageSizeField?: string
  totalField?: string
  dataField?: string
}

export default async function (props: CurdProps): Promise<StateProps> {
  const baseApi = useApi(props.baseApi)

  const state = reactive<StateProps>({
    searchParams: props.searchParams ? { ...props.searchParams } : {},
    dataSource: [],
    selectedRowKeys: [],
    selectedRows: [],
    record: {} as any,
    visible: false,
    isEdit: false,
    loading: false,
    confirmLoading: false,
    handleCreateClick,
    handleEditClick,
    save,
    query,
    reset,
    reload,
    deleteFunc,
    batchDelFunc,
    onSelectChange,
    pagination: {
      total: 0,
      current: 1,
      pageSize: props.pageSize || 10,
      showTotal: (total: number) => `共 ${total} 项`,
      onChange: (current: number, pageSize: number) => {
        state.pagination.current = current
        if (props.paginationNoSearch) return
        query()
      }
    }
  })

  onMounted(() => {
    if (props.noInitQuery) return
    query()
  })

  function onSelectChange(selectedRowKeys: any[], selected: any[]) {
    state.selectedRowKeys = selectedRowKeys
    state.selectedRows = selected
  }

  async function save(params: any) {
    let method = state.isEdit ? baseApi.update : baseApi.create
    state.confirmLoading = true
    try {
      const { data, status }: any = await method(params)
      if (status === 200 && data.data) {
        message.success('保存成功！')
        state.visible = false
        state.isEdit = false
        await query()
        props.refresh && props.refresh()
      } else {
        message.error('保存失败，' + data.message)
      }
    } catch (e) {
      console.log(e)
      // let msg = '保存失败!'
      // if(e.response && e.response.data.data){
      //     msg += e.response.data.data
      // }
      // message.error(msg)
    } finally {
      state.confirmLoading = false
    }
  }

  async function deleteFunc(params: any) {
    const content = getDelContent('确认删除？')
    try {
      Modal.confirm({
        content,
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          const {
            data: { code },
            status
          }: any = await baseApi.deleteFunc(params)
          if (status === 200 && code === 200) {
            message.success('删除成功！')
            await query()
            props.refresh && props.refresh()
          } else {
            message.error('删除失败！')
          }
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  async function batchDelFunc(data: any) {
    if (!data && !state.selectedRowKeys.length) return
    try {
      let param = data || state.selectedRowKeys
      const content = getDelContent(`确认删除${state?.selectedRowKeys.length}项？`)
      Modal.confirm({
        content,
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          // @ts-ignore
          const {
            data: { code },
            status
          }: any = await baseApi.batchDelFunc(param)
          if (status === 200 && code === 200) {
            message.success('删除成功！')
            state.selectedRowKeys = []
            state.selectedRows = []
            await query()
          } else {
            message.error('删除失败！')
          }
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
  async function reload() {
    await query()
    props.refresh && props.refresh()
  }
  async function reset() {
    state.pagination.current = 1
    query()
  }
  async function query(val?: any) {
    const params: any = {
      [props.pageField ? props.pageField : 'current']: state.pagination.current,
      [props.pageSizeField ? props.pageSizeField : 'size']: state.pagination.pageSize,
      ...state.searchParams,
      ...val
    }
    state.loading = true
    try {
      const res: any = await baseApi.query(params)
      const { data, status } = res
      if (status === 200) {
        const dataField = props.dataField || 'data.records'
        const totalField = props.totalField || 'data.total'
        state.dataSource = props.renderData ? props.renderData(getData(data, dataField)) : getData(data, dataField)
        state.pagination.total = getData(data, totalField)
        state.loading = false
      } else {
        state.loading = false
      }
    } catch (e) {
      state.loading = false
    }
  }

  function getDelContent(text: any) {
    return <span style={{ fontSize: '.24rem' }}>{text}</span>
  }

  const getData = new Function(
    'data',
    'field',
    `
          var result = Object.assign({},data);
          field.split('.').forEach(i=>{
            result = result[i]
          })
          return result;
      `
  )

  /*
   * 新建点击
   * */
  function handleCreateClick() {
    state.record = {}
    state.visible = true
    state.isEdit = false
  }
  // 编辑点击

  function handleEditClick(record: any = {}) {
    state.record = { ...record }
    state.visible = true
    state.isEdit = true
  }

  return state
}