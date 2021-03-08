/* eslint-disable */
const items = {
  "key": "address",
  "list": {
    "zhCN": {
        "ls1": "地址薄",
        "ls2": "添加新地址",
        "ls3": "是否删除{address}（{chain}）?",
        "ls4": "添加{chain}地址",
        "ls5": "名称",
        "ls6": "请输入名称",
        "ls7": "地址",
        "ls8": "输入或粘贴{chain}地址",
        "ls9": "请输入正确地址",
        "ls10": "提示",
        "ls11": "取消",
        "ls12": "确认",
        "ls13": "删除",
        "ls14": "添加成功",
        "ls15": "删除成功",
        "ls16": "该账户已存在",
        "ls17": "请输入地址",
        "ls18": "暂无添加地址",
        "ls19": "输入或粘贴USDT({chain})地址"
    },
    "zhTW": {
        "ls1": "地址薄",
        "ls2": "添加新地址",
        "ls3": "是否删除{address}（{chain}）?",
        "ls4": "添加{chain}地址",
        "ls5": "名稱",
        "ls6": "請輸入名稱",
        "ls7": "地址",
        "ls8": "輸入或粘貼{chain}地址",
        "ls9": "請輸入正確地址",
        "ls10": "提示",
        "ls11": "取消",
        "ls12": "確認",
        "ls13": "删除",
        "ls14": "添加成功",
        "ls15": "删除成功",
        "ls16": "該帳戶已存在",
        "ls17": "請輸入地址",
        "ls18": "暫無添加地址",
        "ls19": "輸入或粘貼USDT({chain})地址"
    },
    "en": {
        "ls1": "Address book",
        "ls2": "Add new address",
        "ls3": "Whether to delete {address}({chain})?",
        "ls4": "Add {chain} address",
        "ls5": "Name",
        "ls6": "Please enter the name",
        "ls7": "Address",
        "ls8": "Enter or paste the {chain} address",
        "ls9": "Please enter the correct address",
        "ls10": "Prompts",
        "ls11": "Cancel",
        "ls12": "Confirm",
        "ls13": "Delete",
        "ls14": "Added successfully",
        "ls15": "Deleted",
        "ls16": "The account already existed",
        "ls17": "Please enter the address",
        "ls18": "No address added",
        "ls19": "Enter or paste the USDT ({chain}) address"
    },
    "ko": {
        "ls1": "주소록",
        "ls2": "새로운 주소 추가",
        "ls3": "{address}({chain})를 삭제하시겠습니까",
        "ls4": "{chain} 주소 추가",
        "ls5": "이름",
        "ls6": "이름을 입력해주세요.",
        "ls7": "주소",
        "ls8": "{chain} 주소를 입력 또는 붙여넣기 해주세요.",
        "ls9": "정확한 주소를 입력해주세요",
        "ls10": "알림",
        "ls11": "취소",
        "ls12": "확인",
        "ls13": "삭제",
        "ls14": "추가 성공",
        "ls15": "삭제 성공",
        "ls16": "이 계정은 이미 존재합니다.",
        "ls17": "주소를 입력해주세요.",
        "ls18": "추가된 주소가 없습니다.",
        "ls19": "USDT({chain}) 주소를 입력 또는 붙여넣기 해주세요."
    }
}
}

const keys = items.key;
const { en, zhCN, zhTW, ko } = items.list;

export default {
  en: { [keys]: en },
  zhCN: { [keys]: zhCN },
  zhTW: { [keys]: zhTW },
  ko: { [keys]: ko }
}
