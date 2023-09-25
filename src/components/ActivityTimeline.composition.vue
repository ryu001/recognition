<template>
  <div>ss{{ aa }}</div>
</template>

<script lang="ts">
import { defineProps, onMounted ,ref} from "vue"

const aa = ref("")
export default {
  props: ['para'],
  setup(props) {
    aa.value = props.para
    alert(aa.value)
  }
}




</script>