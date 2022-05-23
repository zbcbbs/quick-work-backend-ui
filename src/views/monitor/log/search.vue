<template>
  <div v-if="crud.props.searchToggle">
    <el-input
      v-model="query.content"
      clearable
      size="small"
      placeholder="请输入日志描述"
      style="width: 200px;"
      class="filter-item"
    />
    <date-range-picker v-model="query.time" class="date-item" />
    <rrOperation />
  </div>
</template>

<script>
import { header } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import DateRangePicker from '@/components/DateRangePicker'
export default {
  components: { rrOperation, DateRangePicker },
  mixins: [header()]
}
</script>
