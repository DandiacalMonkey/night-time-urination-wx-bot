enum BotMessageType {
    TEXT = 'text',
    MARKDOWN = 'markdown',
    IMAGE = 'image',
    NEWS = 'news',
    FILE = 'file',
    TEMPLATE_CARD = 'template_card'
}

interface BotTextMessage {
    content: string;
    mentioned_list: Array<string>;
    mentioned_mobile_list: Array<string>;
}

interface BotImageMessage {
    base64: string;
    md5: string;
}

interface BotNewsArticles {
    title: string;
    description: string;
    url: string;
    picurl: string;
}

interface BotNewsMessage {
    articles: Array<BotNewsArticles>;
}

interface BotFileMessage {
    media_id: string;
}

class BotMessageTask {
    name = '';
    msgtype = BotMessageType.TEXT;
    text: BotTextMessage = {
        content: '',
        mentioned_list: new Array<string>(),
        mentioned_mobile_list: new Array<string>(),
    };
    image: BotImageMessage = {
        base64: '',
        md5: '',
    }
    news: BotNewsMessage = {
        articles: new Array<BotNewsArticles>()
    }
    file: BotFileMessage = {
        media_id: ''
    }
}

class BotMessage {
    key = '';
    tasks: Array<BotMessageTask> = new Array<BotMessageTask>();
}

export {BotMessageType, BotTextMessage, BotImageMessage, BotNewsArticles, BotNewsMessage, BotFileMessage, BotMessageTask, BotMessage};