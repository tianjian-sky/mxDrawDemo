<template>
    <div class="measure-tools">
        <ul>
            <li v-for="item in list" :class="{active: mode == item.id}" :key="item.id" @click.stop="changeType(item.id)">{{item.name}}</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'MeasureTools',
    emit: ['postMessage'],
    components: {},
    data() {
        return {
            mode: '',
            list: [
                { id: 1, name: '直线测量', cmd: 'Cbim_MeasureDistance' },
                { id: 2, name: '角度测量', cmd: 'Cbim_MeasureAngle' },
                { id: 3, name: '面积测量', cmd: 'Cbim_MeasureArea' }
            ]
        }
    },
    watch: {
        mode(val) {
            if (val) {
                this.$emit('postMessage', this.list.find(item => item.id === val).cmd)
            }
        }
    },
    methods: {
        changeType(type) {
            if (this.mode === type) {
                this.mode = ''
            } else {
                this.mode = type
            }
        }
    }
}
</script>

<style>
.measure-tools {
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 100px;
    top: 200px;
    color: #fff;
    align-items: center;
}
.measure-tools li {
    cursor: pointer;
    list-style-type: none;
}
.measure-tools li.active {
    color: yellow;
}
</style>
