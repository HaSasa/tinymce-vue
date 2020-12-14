// https://activity.hdslb.com/blackboard/static/de8b0fe7cefc13edb9f88e6bf1d5bcf3/fmdajifKW.js ==》中文包地址
// https://activity.hdslb.com/blackboard/static/de8b0fe7cefc13edb9f88e6bf1d5bcf3/content.min.css ==》skin_url的css
// https://activity.hdslb.com/blackboard/static/de8b0fe7cefc13edb9f88e6bf1d5bcf3/skin.min.css ==》skin_url的css
// https://activity.hdslb.com/blackboard/static/de8b0fe7cefc13edb9f88e6bf1d5bcf3/gLnJ79BV3z.css ==》content defalult的css

const defaultOptions = {
  menubar: true,
  branding: false,
  language_url: false || 'https://activity.hdslb.com/blackboard/static/de8b0fe7cefc13edb9f88e6bf1d5bcf3/fmdajifKW.js',
  height: 500,
  language: 'zh_CN',
  toolbar_mode: 'wrap', // floating wrap sliding scrolling
  default_link_target: '_blank',
  content_style: 'img,video {max-width:100%}',
  fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
  // 此项设置为空，则从word复制过来的样式，全部不保留
  paste_retain_style_properties: 'color background backgroud-color text-align font-size',
  quickbars_insert_toolbar: 'quicklink quickimage quicktable',
  quickbars_selection_toolbar: 'bold italic | h1 h2 h3 forecolor backcolor blockquote removeformat quicklink',
  // 必须用绝对路径引用，不然iframe引入的css读取不到
  skin_url: 'https://lib.baomitu.com/tinymce/5.6.2/skins/ui/oxide',
  content_css: 'https://lib.baomitu.com/tinymce/5.6.2/skins/content/default/content.min.css',
  formats: { blockquote: { block: 'blockquote', styles: { paddingLeft: '15px', borderLeft: '3px solid #ddd' } } }
}

const defaultPlugins = []

const defaultToolbar = []

export { defaultOptions, defaultPlugins, defaultToolbar }
