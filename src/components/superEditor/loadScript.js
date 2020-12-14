import tinymce from 'tinymce'
// 引入主题
import 'tinymce/themes/silver'
// 引入图标
import 'tinymce/icons/default'
// 引入语言
import './langs/zh_CN'
// 引入插件
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/code'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/emoticons' // 表情需要引用两个
import 'tinymce/plugins/emoticons/js/emojis' // 表情
import 'tinymce/plugins/fullpage'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/help'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/image'
import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/noneditable'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/print'
import 'tinymce/plugins/quickbars'
import 'tinymce/plugins/save'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/spellchecker'
import 'tinymce/plugins/tabfocus'
import 'tinymce/plugins/table'
import 'tinymce/plugins/template'
import 'tinymce/plugins/textpattern'
import 'tinymce/plugins/toc'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
// import 'tinymce/plugins/media'
import './plugins/media' // 使用魔改后的media插件，可以播放编辑

export { tinymce }

function load_script(xyUrl, callback) {
  var head = document.getElementsByTagName('head')[0]
  var script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = xyUrl
  //借鉴了jQuery的script跨域方法
  script.onload = script.onreadystatechange = function() {
    if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
      callback && callback()
      // Handle memory leak in IE
      script.onload = script.onreadystatechange = null
      if (head && script.parentNode) {
        head.removeChild(script)
      }
    }
  }
  // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
  head.insertBefore(script, head.firstChild)
}
