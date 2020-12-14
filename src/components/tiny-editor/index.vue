<script>
import { tinymce, defaultPlugins, defaultToolbar } from './config'

// debug 模式
const INIT = 0
const INPUT = 1
const status = ['INIT', 'INPUT', 'CHANGED']
const changedLog = (debug) => {
  if (!debug) return () => false
  console.warn('编辑器进入debug模式')
  return (e, _status, val, oldVal) => console.log(`来自：%s | 状态：%s \n %s \n %s`, e.type, status[_status], val, oldVal)
}
export default {
  name: 'index',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: { type: String, default: '' },
    height: { type: Number, default: 500 },
    plugins: { type: [Array, String], default: () => [] },
    toolbar: { type: [Array, String], default: () => [] },
    //  图片上传接口地址，不传，默认图片以base64形式存在
    imageUploadUrl: { type: String, default: '' },
    // 图片上传成功，需要return success(图片结果)
    imageUploadSuccess: { type: Function, default: null },
    // 图片上传进度
    imageUploadProgress: { type: Function, default: null },
    // 图片上传前校验 reutrn true/false
    imageUploadBefore: { type: Function, default: null },
    // 图片上传接口接收的name属性
    imageUploadName: { type: String, default: 'file' },
    // 图片上传的额外参数
    imageUploadData: { type: Object, default: () => ({}) },

    // 文件上传地址
    fileUploadUrl: { type: String, default: '' },
    fileUploadBefore: { type: Function, default: null },
    fileUploadSuccess: { type: Function, default: null },
    fileUploadName: { type: String, default: 'file' },
    // 文件上传额外参数
    fileUploadData: { type: Object, default: () => ({}) },
    fileUploadAccept: { type: String, default: '*' },
    pasteFilter: { type: Function, default: null },
    // debug 模式
    debug: { type: Boolean, default: false }
  },
  data() {
    return {
      id: 'tinymce-' + Date.now() + Math.floor(Math.random() * 1000),
      editor: null,
      options: {
        menubar: true,
        branding: false,
        height: this.height, //编辑器高度
        content_style: 'img,video {max-width:100%}',
        toolbar_mode: 'wrap', // floating wrap sliding scrolling
        language: 'zh_CN',
        default_link_target: '_blank',
        fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
        language_url: '/tinymce/lang/zh_CN.js',
        skin_url: '/tinymce/skins/ui/oxide', // 必须用绝对路径引用，不然iframe引入的css读取不到
        content_css: '//lib.baomitu.com/tinymce/5.6.2/skins/content/default/content.min.css',
        quickbars_selection_toolbar: 'bold italic | h1 h2 h3 forecolor backcolor blockquote removeformat quicklink',
        quickbars_insert_toolbar: 'quicklink quickimage quicktable',
        paste_retain_style_properties: 'color background backgroud-color text-align font-size', // 此项设置为空，则从word复制过来的样式，全部不保留
        file_picker_types: 'file media',
        paste_preprocess: this.pastePreprocess,
        images_upload_handler: this.uploadImage,
        file_picker_callback: this.uploadFile,
        formats: {
          blockquote: { block: 'blockquote', styles: { paddingLeft: '15px', borderLeft: '3px solid #ddd' } }
        }
      }
    }
  },
  methods: {
    setup(editor) {
      editor.on('init', () => {
        this.setContent(this.value, editor)
      })
      editor.on('keyup input', () => {
        //只在编辑器中打字才会触发
        //编辑器录入文字时标记为`INPUT`状态
        this.status = INPUT
      })
      editor.on('SetContent', (e) => {
        //编辑器在插入图片和撤销/重做时触发，组件content更新数据也会导致触发
        //编辑器在响应`setContent`方法后标记为`INPUT`状态
        this.status = INPUT
        this.changedLog(e, this.status, editor.getContent(), '--')
      })
      editor.on('Blur', (e) => {
        this.status = INIT
        this.changedLog(e, this.status, editor.getContent(), '--')
      })
      editor.on('input keyup Change Undo Redo ExecCommand NodeChange', (e) => {
        this.onChanged(e, editor)
      })
    },
    setContent(val, editor) {
      if (!editor) editor = this.editor
      return editor.setContent(val)
    },
    resetContent(val, editor) {
      if (!editor) editor = this.editor
      if (editor.resetContent) return editor.resetContent(val)
      editor.setContent(val)
      editor.setDirty(false)
      editor.undoManager.clear()
    },
    onChanged(e, editor) {
      if (!editor) editor = this.editor
      const content = editor.getContent()
      this.changedLog(e, this.status, content, '--')
      this.$emit('change', content)
    },
    // 上传图片
    uploadImage(blobInfo, success, failure, progress) {
      const that = this
      // 自定义校验，默认不执行
      const beforeRes = this.imageUploadBefore ? !!this.imageUploadBefore(blobInfo.blob()) : true
      if (!beforeRes) {
        return false
      }
      if (this.imageUploadUrl) {
        let xhr, formData
        xhr = new XMLHttpRequest()
        xhr.withCredentials = false
        xhr.open('POST', this.imageUploadUrl)
        xhr.upload.onprogress = function(e) {
          progress((e.loaded / e.total) * 100)
          that.imageUploadProgress && that.imageUploadProgress((e.loaded / e.total) * 100)
        }
        xhr.onload = function() {
          let response
          if (xhr.status == 403) {
            failure('HTTP Error: ' + xhr.status, { remove: true })
            return
          }
          if (xhr.status < 200 || xhr.status >= 300) {
            failure('HTTP Error: ' + xhr.status)
            return
          }
          response = JSON.parse(xhr.responseText)
          // 上传成功回调函数，需要操作 return success(response.xxxx)
          that.imageUploadSuccess ? that.imageUploadSuccess(response, success) : success('data:image/jpeg;base64,' + blobInfo.base64())
        }
        xhr.onerror = function() {
          failure('由于传输错误导致图像上传失败. Code: ' + xhr.status)
        }
        formData = new FormData()
        formData.append(this.imageUploadName || 'file', blobInfo.blob(), blobInfo.filename())
        if (Object.keys(this.imageUploadData).length) {
          for (let key in this.imageUploadData) {
            formData.append(key, this.imageUploadData[key])
          }
        }
        xhr.send(formData)
      } else {
        success('data:image/jpeg;base64,' + blobInfo.base64())
      }
    },
    // 上传文件
    uploadFile(callback, value, meta) {
      const that = this
      // 自定义校验，默认不执行

      //文件分类
      let filetype = ''
      //   //为不同插件指定文件类型及后端地址
      switch (meta.filetype) {
        case 'image':
          filetype = '.jpg, .jpeg, .png, .gif, .webp'
          break
        case 'media':
          filetype = '.mp3, .mp4'
          break
        case 'file':
          filetype = this.fileUploadAccept
          break
        default:
          return
      }

      if (this.fileUploadUrl) {
        //   //模拟出一个input用于添加本地文件
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', filetype)
        input.click()
        input.onchange = function() {
          const file = input.files[0]
          const beforeRes = that.fileUploadBefore ? !!that.fileUploadBefore(file) : true
          if (!beforeRes) {
            return false
          }

          let xhr, formData
          xhr = new XMLHttpRequest()
          xhr.withCredentials = false
          xhr.open('POST', that.fileUploadUrl || '')
          xhr.onload = function() {
            let json
            if (xhr.status !== 200) {
              alert('HTTP Error: ' + xhr.status + ' ==> ' + xhr.statusText)
              return
            }
            json = JSON.parse(xhr.responseText)
            const cb = (url) => {
              return callback(url, { text: file.name, title: file.name })
            }
            that.fileUploadSuccess ? that.fileUploadSuccess(cb, json) : callback('', { text: '', title: '' })
          }
          formData = new FormData()
          formData.append('file_up' || that.fileUploadName, file, file.name)
          // 插入额外餐数
          if (Object.keys(that.fileUploadData).length) {
            for (let key in that.fileUploadData) {
              formData.append(key, that.fileUploadData[key])
            }
          }
          const cookie =
            '_AJSESSIONID=8b23987a1d74b325eb3732740e707e91; username=hanyang; _gitlab_session=82e0b72e4f827b75ad35184a16e4fa8f; experimentation_subject_id=eyJfcmFpbHMiOnsibWVzc2FnZSI6IkltUmpPR05sWkRGakxXWXdOVFF0TkRVNFpDMDRNak14TFRWbU5ERm1NRFJtTm1NellTST0iLCJleHAiOm51bGwsInB1ciI6ImNvb2tpZS5leHBlcmltZW50YXRpb25fc3ViamVjdF9pZCJ9fQ; known_sign_in=NHJnaFR5NzZyRHFvL2ppM0N2Tm5sYmtMRWFKZDlXckRydG4rUk9PRmZoMzNuZzBWNk1sMVl4Rm5wUG5QUHlJcmdVQXFiSnlUcC9iR0NNSlFRNjlnUVVCbXhkNXVINEhlMkJnT3FkVytRZGs0OWM2amRjem93Zm4vZE15NVk5L3UtLXNRR040SFg5MWFJaWpSRVJDNklROEE9PQ; mng-go=e04c83577c1389dd87d47af7dbea5d1e16c1e00f2f56a3b98668fc04b6503e94'
          xhr.setRequestHeader('Cookie', cookie)
          xhr.send(formData)
        }
      } else {
        return false
      }
    },
    // 复制之前的过滤操作
    pastePreprocess(plugin, args) {
      // 粘贴复制的内容之前的处理，在此可以做一些前置操作 如过滤，替换等等
      // console.log(args.content, '1254')
      return this.pasteFilter ? this.pasteFilter(args) : args.content
    }
  },
  created() {
    this.changedLog = changedLog(this.debug)
    if (typeof tinymce === 'undefined') throw new Error('tinymce undefined')
  },
  beforeMount() {
    const options = Object.assign({}, this.options, {
      selector: '#' + this.id,
      toolbar: this.toolbar.length ? this.toolbar : defaultToolbar.join('|'),
      plugins: this.plugins.length ? this.plugins : defaultPlugins,
      setup: this.setup
    })
    this.editor = tinymce.createEditor(options.selector, options)
  },
  updated() {
    this.editor.render()
  },
  beforeDestroy: function() {
    this.editor.remove()
  },
  mounted() {
    this.editor.targetElm = this.$el
    this.editor.render()
  },
  render(createElement) {
    if (typeof tinymce === 'undefined') {
      return createElement('div', 'tinymce is undefined')
    }
    return createElement('div', {
      attrs: { id: this.id, class: 'ty-editor__wrap' }
    })
  }
}
</script>

<style lang="scss" scoped>
.ty-editor__wrap + ::v-deep div.tox {
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
