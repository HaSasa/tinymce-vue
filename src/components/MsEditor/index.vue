<script>
import tinymce from 'tinymce'
// 主题图标
import 'tinymce/themes/silver'
import 'tinymce/icons/default'
// 语言
import './zh_CN'
// 插件
import 'tinymce/plugins/advlist' //  高级列表
// import 'tinymce/plugins/anchor' // 锚点事件 去掉锚点，基本没有用到的地方
import 'tinymce/plugins/autolink' // 自动链接
import 'tinymce/plugins/autoresize' // 编辑器自适应
import 'tinymce/plugins/autosave' // 自动保存
// import 'tinymce/plugins/bbcode' //
import 'tinymce/plugins/charmap' // 特殊字符
import 'tinymce/plugins/code' // 编辑源码
import 'tinymce/plugins/codesample' // 代码示例
import 'tinymce/plugins/directionality' // 文字方向
// import 'tinymce/plugins/fullpage' // 文档属性
import 'tinymce/plugins/fullscreen' // 全屏
import 'tinymce/plugins/help' //帮助
import 'tinymce/plugins/hr' //水平分割线
import 'tinymce/plugins/image' // 插入编辑图片
import 'tinymce/plugins/imagetools' // 图片编辑工具
// import 'tinymce/plugins/importcss' // 引入css
import 'tinymce/plugins/insertdatetime' //插入时间选择
// import 'tinymce/plugins/legacyoutput' //输出html4
import 'tinymce/plugins/link' //超链接
import 'tinymce/plugins/lists' //列表插件
// import 'tinymce/plugins/media' //插入编辑媒体
// 使用魔改自定义媒体插件
// import './plugins/media'

import 'tinymce/plugins/nonbreaking' //插入不间断空格
import 'tinymce/plugins/noneditable' //插入不可编辑元素
import 'tinymce/plugins/pagebreak' //插入分页符
import 'tinymce/plugins/paste' //打印
import 'tinymce/plugins/quickbars' //快捷工具栏
import 'tinymce/plugins/save' //保存
import 'tinymce/plugins/searchreplace' //查找替换
import 'tinymce/plugins/spellchecker' //拼写检查
import 'tinymce/plugins/tabfocus' //切入切出
import 'tinymce/plugins/table' //表格插件
// import 'tinymce/plugins/template' //内容模板
// import 'tinymce/plugins/textcolor' //文字颜色 已经集成到编辑器内部
import 'tinymce/plugins/textpattern' //快速排版
import 'tinymce/plugins/toc' //目录生成器
import 'tinymce/plugins/visualblocks' //显示元素范围
import 'tinymce/plugins/visualchars' //显示不可见字符
// import 'tinymce/plugins/wordcount' //字数统计 这个插件有bug，数字不会统计
import 'tinymce/plugins/preview' //预览
import 'tinymce/plugins/print'
import 'tinymce/plugins/emoticons' // 表情插件
import 'tinymce/plugins/emoticons/js/emojis' // 表情插件

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
  name: 'MsEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    imageUploadUrl: {
      type: String,
      default: ''
    },
    imageUploadSuccess: {
      type: Function,
      default: null
    },
    imageUploadProgress: {
      type: Function,
      default: null
    },
    imageUploadBefore: {
      type: Function,
      default: null
    },
    imageUploadName: {
      type: String,
      default: 'file'
    },
    plugins: {
      type: [String, Array],
      default: () => [
        'advlist  autolink autosave', // 去掉autoresize anchor
        'charmap code codesample directionality',
        'fullscreen help hr image imagetools insertdatetime',
        'link lists nonbreaking noneditable pagebreak paste', // media
        'quickbars save searchreplace spellchecker tabfocus table',
        'textpattern toc visualblocks visualchars preview print emoticons'
      ]
    },
    toolbar: {
      type: [String, Array],
      default: () => [
        'undo redo',
        'fullscreen',
        'bold italic underline strikethrough hr',
        'forecolor backcolor  subscript superscript removeformat', //  未使用 blockquote  tiny对此没有添加样式，不建议使用
        'styleselect fontselect fontsizeselect', // formatselect标题设置配置 styleselect包含除了字体选择之外的所有配置项
        'align', // alignleft aligncenter alignright alignjustify // 位置简写为align
        'image link table', // media暂时去掉media配置，因为默认图样式展示不太友好
        'numlist bullist',
        'outdent indent',
        'pagebreak | charmap emoticons',
        'codesample ltr rtl', // 去掉anchor，基本没有用到的地方, 去掉codesample，除非
        'preview print'
        // 'bold italic strike styleselect',
        // 'forecolor backcolor',
        // 'bullist numlist outdent indent',
        // 'link image emoticons',
        // 'alignleft aligncenter alignright alignjustify',
        // 'hr',
        // 'code'
      ]
    },
    debug: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      id: 'vue-tinymce-' + Date.now() + Math.floor(Math.random() * 1000),
      editor: null,
      status: INIT,
      resize: true,
      setting: {
        readonly: this.disabled || false,
        skin: false,
        content_css: false,
        menubar: true,
        branding: false,
        height: 500, //编辑器高度
        min_height: 400,
        toolbar_mode: 'sliding', // floating wrap sliding scrolling
        language: 'zh_CN',
        default_link_target: '_blank',
        object_resizing: true,
        end_container_on_empty_block: true,
        // quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
        quickbars_selection_toolbar: 'bold italic |  h2 h3 blockquote forecolor backcolor quicklink quickimage quicktable',
        contextmenu: 'link image imagetools table',
        noneditable_noneditable_class: 'mceNonEditable',
        plugins: this.plugins,
        toolbar: this.toolbar.join('|'),
        images_upload_handler: this.uploadImage,
        // file_picker_callback: this.uploadFile
        fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
        formats: {
          blockquote: { block: 'blockquote', styles: { paddingLeft: '10px', borderLeft: '3px solid #ddd' } },
          pre: { block: 'pre', styles: { background: 'red' } }
        }
      }
    }
  },
  watch: {
    value(val) {
      this.changedLog({ type: 'propsChanged' }, this.status, val, '--')
      if (this.status === INPUT) return
      if (!this.editor || !this.editor.initialized) return // fix editor plugin is loading and set content will throw error.
      if (val === null) return this.resetContent('')
      this.setContent(val)
    },
    disabled(val) {
      this.editor.setMode(val ? 'readonly' : 'design')
    }
  },
  render(createElement) {
    if (typeof tinymce === 'undefined') {
      return createElement('div', 'tinymce is undefined')
    }
    return createElement('div', {
      attrs: { id: this.id }
    })
  },
  created() {
    this.changedLog = changedLog(this.debug)
    if (typeof tinymce === 'undefined') throw new Error('tinymce undefined')
  },
  beforeMount() {
    const setting = Object.assign({}, this.setting, {
      selector: '#' + this.id,
      setup: (editor) => {
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
      }
    })

    this.editor = tinymce.createEditor(setting.selector, setting)
  },
  mounted() {
    this.editor.targetElm = this.$el
    this.editor.render()
  },
  updated() {
    this.editor.render()
  },
  beforeDestroy: function() {
    this.editor.remove()
  },
  methods: {
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
        failure('图片校验失败')
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

        xhr.send(formData)
      } else {
        success('data:image/jpeg;base64,' + blobInfo.base64())
      }
    }
  }
}
</script>

<style lang="scss">
//@import '~tinymce/skins/content/default/content.min.css';
//@import '~tinymce/skins/ui/oxide/content.min.css';
//@import '~tinymce/skins/ui/oxide/skin.min.css';
//.tox-tinymce {
//  border-radius: 6px;
//}
//.tox .tox-menubar,
//.tox .tox-statusbar {
//  background: #f0f0f0;
//}
//.tox .tox-toolbar,
//.tox .tox-toolbar__overflow,
//.tox .tox-toolbar__primary,
//.tox.tox-tinymce-aux .tox-toolbar__overflow {
//  background-color: #f0f0f0;
//}

/*//.mce-content-body {*/
/*//  [contenteditable='false'][data-mce-selected] {*/
/*//    cursor: not-allowed;*/
/*//    outline: 3px solid #b4d7ff;*/
/*//  }*/
/*//}*/
</style>
