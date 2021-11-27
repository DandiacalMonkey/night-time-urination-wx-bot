import { BotMessageTask, BotMessage } from './BotMessage'
import axios from 'axios'
import moment from 'moment';

class BotMessageSender {
    sendTaskImmediately(task: BotMessageTask, key:string) {
        axios.post('/qyapi/cgi-bin/webhook/send', task, {
            params: {
                key
            }
        }).then((respons) => console.log(respons));
    };
    sendMessageSchedule(message: BotMessage) {
        let that = this;
        this.previousScanTime = moment();
        // 每100ms执行一次扫描
        this.scanTimerId = window.setInterval(() => {
            let current = moment();
            for (const task of message.tasks) {
                let taskTrigMoment = moment(task.time, "HH:mm");
                // 验证任务是否仅工作日生效
                if (task.weekdays === true && this.isWeekDays(taskTrigMoment) === false) {
                    continue;
                }
                // 验证星期
                if (task.week.includes(taskTrigMoment.day()) == false) {
                    continue;
                }
                if (taskTrigMoment.isBetween(that.previousScanTime, current)) {
                    axios.post('/qyapi/cgi-bin/webhook/send', task, {
                        params: {
                            key: message.key
                        }
                    }).then((respons) => alert(JSON.stringify(respons)));
                }
            }
            that.previousScanTime = current;
        }, 100);
    };
    cancelSendMessageSchedule() {
        window.clearInterval(this.scanTimerId);
    }
    // 确定是否是工作日
    isWeekDays(checked_moment: moment.Moment): boolean {
        // 节假日
        let holidays = new Set<string>();
        holidays.add("2022/01/01");
        holidays.add("2022/01/02");
        holidays.add("2022/01/03");
        holidays.add("2022/01/31");
        holidays.add("2022/02/01");
        holidays.add("2022/02/02");
        holidays.add("2022/02/03");
        holidays.add("2022/02/04");
        holidays.add("2022/02/05");
        holidays.add("2022/02/06");
        holidays.add("2022/04/03");
        holidays.add("2022/04/04");
        holidays.add("2022/04/05");
        holidays.add("2022/04/30");
        holidays.add("2022/05/01");
        holidays.add("2022/05/02");
        holidays.add("2022/05/03");
        holidays.add("2022/05/04");
        holidays.add("2022/06/03");
        holidays.add("2022/06/04");
        holidays.add("2022/06/05");
        holidays.add("2022/09/10");
        holidays.add("2022/09/11");
        holidays.add("2022/09/12");
        holidays.add("2022/10/01");
        holidays.add("2022/10/02");
        holidays.add("2022/10/03");
        holidays.add("2022/10/04");
        holidays.add("2022/10/05");
        holidays.add("2022/10/06");
        holidays.add("2022/10/07");
        if (holidays.has(checked_moment.format("YYYY/MM/dd"))) {
            return false;
        }
        // 特殊工作日(节假日调休)
        let fuckDays = new Set<string>();
        fuckDays.add("2022/01/29");
        fuckDays.add("2022/01/30");
        fuckDays.add("2022/04/02");
        fuckDays.add("2022/04/24");
        fuckDays.add("2022/05/07");
        fuckDays.add("2022/10/08");
        fuckDays.add("2022/10/09");
        if (fuckDays.has(checked_moment.format("YYYY/MM/dd"))) {
            return true;
        }
        // 周六周日
        if (checked_moment.day() == 0 || checked_moment.day() == 6) {
            return false;
        }
        return true;
    }
    // 扫描定时器id
    scanTimerId = 0;
    // 储存每个任务上一次扫描的时间
    previousScanTime = moment();
}

export default BotMessageSender;