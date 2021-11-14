<template>
    <a-list item-layout="horizontal" :data-source="tasks">
    <template #renderItem="{ item, index }">
      <a-list-item v-bind:class="{taskItem: index != selectedIndex, selectedTaskItem: index == selectedIndex}" v-on:click="$emit('selected', index)">
        <a-list-item-meta>
          <template #title>
            <div class="taskItemName">{{ item.name }}</div>
          </template>
          <template #avatar>
            <SettingOutlined />
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { BotMessageTask } from '../scripts/BotMessage'
import { SettingOutlined } from '@ant-design/icons-vue';

export default defineComponent({
    components: {
        SettingOutlined
    },
    props: {
        tasks: Array as PropType<BotMessageTask[]>,
        selectedIndex: Number
    },
    emits: {
        selected(index: number) {
            return true;
        }
    },
    setup(props, context) {
        console.log(props);
    }
});

</script>

<style lang="css">
.taskItem:hover {
    background: rgba(0, 0, 0, 0.1);
}
.selectedTaskItem {
    background: rgba(0, 0, 0, 0.2);
}
.taskItemName {
    user-select: none;
}
</style>