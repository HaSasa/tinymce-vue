<template>
  <div class="hello">
    <el-upload
      v-if="show"
      class="avatar-uploader"
      action="/api/uploadImg"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <div v-html="contentMsg"></div>
    <hr />
    <MsEditor
      v-if="show"
      v-model="contentMsg"
      :image-upload-success="imageUploadSuccess"
      :image-upload-before="beforeAvatarUpload"
      imageUploadUrl="/api/uploadImg"
    ></MsEditor>
    <!--    -->
    <TyEditor
      v-model="contentMsg"
      :image-upload-success="imageUploadSuccess"
      :image-upload-before="beforeAvatarUpload"
      imageUploadUrl="/api/uploadImg"
      :file-upload-success="fileUploadSuccess"
      :file-upload-before="beforeFileUpload"
      :fileUploadData="fileUploadData"
      file-upload-url="/xlive/internal/live-admin/v1/upload/file_internal"
    ></TyEditor>
  </div>
</template>

<script>
import TyEditor from './tiny-editor'
export default {
  name: 'HelloWorld',
  components: { TyEditor },
  props: {
    msg: String
  },
  data() {
    return {
      show: false,
      imageUrl: '',
      contentMsg: 'https://dev-saas.oss-cn-beijing.aliyuncs.com/056eb234fa9844b0b7ec3e13bd39faf7.mp4',
      fileUploadData: {
        bucket: 'live',
        content_type: ''
      }
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      console.log(res, 'res')
      this.imageUrl = res.data.url || URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 10

      if (!isJPG) {
        alert('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        alert('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    imageUploadSuccess(res, suc) {
      return suc(res.data.url)
    },

    fileUploadSuccess(cb, result) {
      console.log(cb, result, ';ggg')
      return cb(result.data.url)
    },
    beforeFileUpload(file) {
      const types = ['png', 'jpg', 'jpeg', 'svga', 'gif', 'webp', 'csv', 'zip', 'md', 'pdf', 'wasm', 'mp3', 'mp4']
      const exitIndex = types.findIndex((v) => file.name.indexOf(v) !== -1)
      let type = types[exitIndex] || ''
      this.fileUploadData.content_type = type
      if (type === 'pdf') {
        this.fileUploadData.content_type = 'application/pdf'
      }
      if (type === 'wasm') {
        this.fileUploadData.content_type = 'application/wasm'
      }

      console.log(exitIndex, 'exitIndex')
      // if (this.fileType === 'pdf') {
      //   this.uploader.content_type = 'application/pdf'
      // }
      // if (this.fileType === 'wasm') {
      //   this.uploader.content_type = 'application/wasm'
      // }
      // this.fileUploadData = ''
      console.log(file, '1234')
      return true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #ccc;
}
.avatar {
  width: 178px;
  height: auto;
  display: block;
}
</style>
