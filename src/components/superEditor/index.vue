<script type="text/jsx">
import { tinymce } from './loadScript'
import { defaultOptions } from './config'
export default {
  name: 'SuperEditor',
  data() {
    return {
      id: 'tinymce-' + Date.now() + Math.floor(Math.random() * 1000),
      editor: null
    }
  },
  methods: {
    async initEditor() {
      const settings = Object.assign(
        {
          target: this.$el,
          selector: '#' + this.id
        },
        {
          ...defaultOptions
        }
      )
      const result = await tinymce.init(settings)
      this.editor = result[0] || null
      console.log(this.editor , 'init')
    }
  },
  mounted() {
   !this.editor &&  this.initEditor()
  },
  updated() {
    this.editor && this.editor.render()
    console.log('updated')
  },
  beforeDestroy() {
    this.editor && this.editor.remove()
    console.log(this.editor, 'des')
  },
  render() {
    const { id } = this
    return <div id={id} class={'super-editor__wrap'} />
  }
}
</script>

<style lang="scss" scoped>
.super-editor__wrap + ::v-deep .tox-tinymce {
  border-radius: 6px;
  .tox-menubar,
  .tox-statusbar {
    background-color: #f0f0f0;
  }
  .tox-toolbar,
  .tox-toolbar__overflow,
  .tox-toolbar__primary,
  &.tox-tinymce-aux .tox-toolbar__overflow {
    background-color: #f0f0f0;
  }
}
</style>
