<template>
  <div class="home">
    <!--    -->
    <!--    <HelloWorld msg="Welcome to Your Vue.js App" />-->
    <SuperEditor></SuperEditor>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import SuperEditor from '@/components/superEditor/index.vue'

export default {
  name: 'Home',
  components: {
    // HelloWorld
    SuperEditor
  },
  data() {
    return {}
  }
}
</script>
