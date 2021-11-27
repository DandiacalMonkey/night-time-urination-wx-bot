<template>
    <div>
        <a-time-picker v-model:value="task.time"
            valueFormat="HH:mm" format="HH:mm"></a-time-picker>
        <a-checkbox v-model:checked="checkAllWeek"
            v-bind:indeterminate="indeterminateWeek"
            v-on:change="onCheckAllWeek">
            全部选择
        </a-checkbox>
        <a-checkbox-group v-model:value="task.week"
            v-bind:options="weekOptions" />
        <a-checkbox v-model:checked="task.weekdays">仅工作日</a-checkbox>
        <a-select v-bind:options="supportMessageTypes"
            v-model:value="task.msgtype">
        </a-select>
        <div id="textSettings" v-if="task.msgtype == BotMessageType.TEXT">
            <div>消息内容</div>
            <a-input v-model:value="task.text.content"></a-input>
            <div>提醒成员id(一般为工号)</div>
            <a-select mode="tags" v-model:value="task.text.mentioned_list">
            </a-select>
            <div>提醒成员手机号</div>
            <a-select mode="tags" v-model:value="task.text.mentioned_mobile_list">
            </a-select>
        </div>
        <div id="textSettings" v-else-if="task.msgtype == BotMessageType.IMAGE">
            <a-upload accept=":image/*"
                v-bind:show-upload-list="false"
                v-model:file-list="imageFileList"
                v-on:change="onImageFileChanged"
                v-bind:before-upload="onBeforeImageUpload">
                <a-button>
                    <upload-outlined></upload-outlined>
                    选择图片
                </a-button>
            </a-upload>
            <img v-if="task.image.base64.length != 0" v-bind:src="'data:image/*;base64,' + task.image.base64">
        </div>
        <div id="textSettings" v-else-if="task.msgtype == BotMessageType.FILE">
            <a-upload accept=":image/*"
                v-bind:show-upload-list="false"
                v-model:file-list="mediaFileList"
                v-on:change="onMediaFileChanged"
                v-bind:custom-request="mediaUploadRequest"
                v-bind:before-upload="onBeforeMediaUpload">
                <a-button>
                    <upload-outlined></upload-outlined>
                    选择文件
                </a-button>
                <a-input v-model:value="task.file.media_id"></a-input>
            </a-upload>
        </div>
        <a-button v-on:click="sendMessage">
            发送
        </a-button>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue'
import { BotMessageTask, BotMessageType, Week } from '../scripts/BotMessage'
import { message } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import { Md5 } from 'ts-md5'
import axios from 'axios'

function getSupportMessageType() {
    // 仅显示当前支持的消息类型
    interface MessageTypeTuple {
        value: BotMessageType,
        label: string
    }
    let supportMessageTypes = new Array<MessageTypeTuple>();
    type BotMessageTypeKey = keyof typeof BotMessageType;
    for (const x in BotMessageType) {
        const y = x as BotMessageTypeKey;
        switch (BotMessageType[y]) {
            case BotMessageType.TEXT:
                supportMessageTypes.push({
                    value: BotMessageType[y],
                    label: "文本"
                });
                break;
            case BotMessageType.IMAGE:
                supportMessageTypes.push({
                    value: BotMessageType[y],
                    label: "图片"
                });
                break;
            case BotMessageType.FILE:
                supportMessageTypes.push({
                    value: BotMessageType[y],
                    label: "文件"
                });
                break;
            default:
                break;
        }
    }
    return supportMessageTypes;
}

interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
  type?: string;
  size: number;
  originFileObj: any;
}

interface FileInfo {
  file: FileItem;
  fileList: FileItem[];
}

export default defineComponent({
    components: {
        UploadOutlined
    },
    props: {
        task: {
            type: Object as PropType<BotMessageTask>,
            require: true,
            default: new BotMessageTask()
        },
        botKey: {
            type: String,
            require: true,
            default: ''
        }
    },
    setup(props, context) {
        // 星期选择，显示选项
        type WeekKeyType = keyof typeof Week;
        const weekOptions = computed(() => {
            interface WeekOptionsItem {
                value: Week;
                label: string;
            }
            let result = new Array<WeekOptionsItem>();
            for (const x in Week) {
                const y = x as WeekKeyType;
                let item: WeekOptionsItem = {
                    value: Week[y],
                    label: ''
                }
                switch (Week[y]) {
                    case Week.MONDAY:
                        item.label = '星期一';
                        result.push(item);
                        break;
                    case Week.TUESDAY:
                        item.label = '星期二';
                        result.push(item);
                        break;
                    case Week.WEDNESDAY:
                        item.label = '星期三';
                        result.push(item);
                        break;
                    case Week.THURSDAY:
                        item.label = '星期四';
                        result.push(item);
                        break;
                    case Week.FRIDAY:
                        item.label = '星期五';
                        result.push(item);
                        break;
                    case Week.SATURDAY:
                        item.label = '星期六';
                        result.push(item);
                        break;
                    case Week.SUNDAY:
                        item.label = '星期日';
                        result.push(item);
                        break;
                    default:
                        break;
                }
            }
            return result;
        });
        // 星期全选选项
        let allWeekOptions = new Array<Week>();
        for (let i = 0; i < 7; ++i) {
            allWeekOptions.push(i);
        }
        // 星期全选、不定标志位
        let checkAllWeek = ref(false);
        let indeterminateWeek = ref(false);
        // 全选按下
        function onCheckAllWeek(event: any) {
            props.task.week = event.target.checked ? allWeekOptions : new Array<Week>();
            indeterminateWeek.value = false;
        };
        // 监视星期选择，确保全选和不定标记
        watch(() => props.task.week, (newValue) => {
            checkAllWeek.value = newValue.length === allWeekOptions.length;
            indeterminateWeek.value = !!newValue.length && newValue.length < allWeekOptions.length;
        });
        // 发送消息
        let supportMessageTypes = ref(getSupportMessageType());
        function sendMessage() {
            axios.post('/qyapi/cgi-bin/webhook/send', props.task, {
                params: {
                    key: props.botKey
                }
            }).then((respons) => console.log(respons));
        };
        // 图片
        let imageFileList = ref(new Array<FileItem>());
        function onBeforeImageUpload(file: FileItem) {
            // 验证格式
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (isJpgOrPng === false) {
                message.error('仅支持JPG或PNG格式');
                return false;
            }
            // 验证大小
            const isLessThan2M = file.size / 1024 / 1024 <= 2;
            if (isLessThan2M === false) {
                message.error('图片大小必须小于2M');
                return false;
            }
            return false;
        }
        function onImageFileChanged(fileInfo: FileInfo) {
            imageFileList.value = [fileInfo.fileList[fileInfo.fileList.length - 1]];
            const readerAsDataURL = new FileReader();
            readerAsDataURL.onload = function () {
                props.task.image.base64 = readerAsDataURL.result as string;
                props.task.image.base64 = 
                    props.task.image.base64.slice(props.task.image.base64.indexOf(',') + 1);
            };
            readerAsDataURL.readAsDataURL(imageFileList.value[0].originFileObj);
            const readerAsBinaryString = new FileReader();
            readerAsBinaryString.onload = function () {
                props.task.image.md5 = Md5.hashAsciiStr(readerAsBinaryString.result as string);

            };
            readerAsBinaryString.readAsBinaryString(imageFileList.value[0].originFileObj);
        }
        // 文件
        function onBeforeMediaUpload(file: FileItem) {
            // 需要先输入key才能上传
            if (props.botKey.length === 0) {
                message.error('请先输入key进行上传');
                return false;
            }
            // 验证大小
            const isLessThan2M = file.size / 1024 / 1024 <= 20 || file.size >= 5;
            if (isLessThan2M === false) {
                message.error('文件大小要求在5B~20M之间');
                return false;
            }
            return true;
        }
        let mediaFileList = ref(new Array<FileItem>());
        function onMediaFileChanged(fileInfo: FileInfo) {
            mediaFileList.value = [fileInfo.fileList[fileInfo.fileList.length - 1]];
        };
        function mediaUploadRequest(options: any) {
            let form = new FormData();
            form.append('file', options.file);
            axios.post('/qyapi/cgi-bin/webhook/upload_media', form,
                {
                    params: {
                        key: props.botKey,
                        type: 'file'
                    }
                }).then(function (response) {
                    if (response.status !== 200 || !response.data.media_id) {
                        message.error('文件上传失败');
                    } else {
                        props.task.file.media_id = response.data.media_id;
                    }
                })
        };
        return {
            weekOptions,
            checkAllWeek,
            indeterminateWeek,
            onCheckAllWeek,
            supportMessageTypes,
            BotMessageType,
            sendMessage,
            imageFileList,
            onBeforeImageUpload,
            onImageFileChanged,
            mediaFileList,
            onBeforeMediaUpload,
            onMediaFileChanged,
            mediaUploadRequest
        }
    }
})
</script>

<style lang="css">
  	
</style>