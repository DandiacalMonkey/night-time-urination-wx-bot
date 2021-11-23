<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    data () {
        return {};
    }
})
</script>

<style lang="css">
html, body {
    width: 100%;
    height: 100%;
}

#app {
    width: 100%;
    height: 100%;
    position: relative;
}
</style>