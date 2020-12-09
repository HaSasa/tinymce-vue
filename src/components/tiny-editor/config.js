import tinymce from 'tinymce'
// 引入主题
import 'tinymce/themes/silver'
// 引入图标
import 'tinymce/icons/default'
// 引入插件
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/autolink'
// import 'tinymce/plugins/autoresize'
import 'tinymce/plugins/autosave'
// import 'tinymce/plugins/bbcode'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/code'
import 'tinymce/plugins/codesample'
// import 'tinymce/plugins/colorpicker' // 已集成到内部，无需引用
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/directionality'

import 'tinymce/plugins/emoticons' // 表情需要引用两个
import 'tinymce/plugins/emoticons/js/emojis' // 表情

import 'tinymce/plugins/fullpage'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/help'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/image'
import 'tinymce/plugins/imagetools'
// import 'tinymce/plugins/importcss'
import 'tinymce/plugins/insertdatetime'
// import 'tinymce/plugins/legacyoutput' 输出html4，已废弃
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'

// import 'tinymce/plugins/media'
import './plugins/media' // 使用魔改后的media插件，可以播放编辑

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
// import 'tinymce/plugins/textcolor' //  已集成到内部，无需引用
import 'tinymce/plugins/textpattern'
import 'tinymce/plugins/toc'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
// import 'tinymce/plugins/wordcount' // 文字统计，此插件统计字数并不理想，不建议使用

// 默认工具栏配置
const defaultToolbar = [
  'undo redo',
  'fullscreen',
  'bold italic underline strikethrough',
  'forecolor backcolor  subscript superscript blockquote removeformat',
  'styleselect fontselect fontsizeselect', // fontselect fontsizeselect formatselect
  'align', // 'alignleft aligncenter alignright alignjustify ',
  'numlist bullist ',
  'outdent indent ',
  'pagebreak hr',
  'charmap emoticons',
  'insertfile image media table link anchor code codesample insertdatetime',
  'ltr rtl',
  'paste copy cut',
  'preview print'
]
// 默认插件配置
const defaultPlugins = [
  'advlist',
  'anchor',
  'autolink',
  // 'autoresize',
  // 'bbcode',
  'charmap',
  'code',
  'codesample',
  // 'colorpicker',
  'contextmenu',
  'directionality',
  'emoticons',
  'fullpage',
  'fullscreen',
  'help',
  'hr',
  'image',
  'imagetools',
  // 'importcss',
  'insertdatetime',
  // 'legacyoutput',
  'link',
  'lists',
  'media',
  'nonbreaking',
  'noneditable',
  'pagebreak',
  'paste',
  'preview',
  'print',
  'quickbars',
  'save',
  'searchreplace',
  'spellchecker',
  'tabfocus',
  'table',
  'tabfocus',
  'template',
  // 'textcolor',
  'textpattern',
  'toc',
  'visualblocks',
  'visualchars'
  // 'wordcount'
]

const contentStyle = 'img,video {max-width:100%}'

export { tinymce, defaultToolbar, defaultPlugins, contentStyle }
