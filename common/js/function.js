let _debounceTimeout = null,
  _throttleRunning = false

/**
 * 防抖
 * @param {Function} 执行函数
 * @param {Number} delay 延时ms   
 */
export const debounce = (fn, delay = 500) => {
  clearTimeout(_debounceTimeout);
  _debounceTimeout = setTimeout(() => {
    fn();
  }, delay);
}
/**
 * 节流
 * @param {Function} 执行函数
 * @param {Number} delay 延时ms  
 */
export const throttle = (fn, delay = 500) => {
  if (_throttleRunning) {
    return;
  }
  _throttleRunning = true;
  fn();
  setTimeout(() => {
    _throttleRunning = false;
  }, delay);
}

/**
 * toast
 */
export const msg = (title = '', param = {}) => {
  if (!title) return;
  uni.showToast({
    title,
    duration: param.duration || 2000,
    mask: param.mask || false,
    icon: param.icon || 'none'
  });
}

/**
 * 获取页面栈
 * @param {Number} preIndex为1时获取上一页
 * @return {Object} 
 */
export const prePage = (preIndex = 1) => {
  const pages = getCurrentPages();
  const prePage = pages[pages.length - (preIndex + 1)];
  return prePage.$vm;
}

/**
 * 格式化时间戳 Y-m-d H:i:s
 * @param {String} format Y-m-d H:i:s
 * @param {Number} timestamp 时间戳   
 * @param {Boolean} isOther 不是时间戳，但是能转换为date类型   
 * @return {String}
 */
export const date = (format, timeStamp, isOther=false) => {
  if (!isOther) {
    if ('' + timeStamp.length <= 10) {
      timeStamp = +timeStamp * 1000;
    } else {
      timeStamp = +timeStamp;
    }
  }
  let _date = new Date(timeStamp),
    Y = _date.getFullYear(),
    m = _date.getMonth() + 1,
    d = _date.getDate(),
    H = _date.getHours(),
    i = _date.getMinutes(),
    s = _date.getSeconds();

  m = m < 10 ? '0' + m : m;
  d = d < 10 ? '0' + d : d;
  H = H < 10 ? '0' + H : H;
  i = i < 10 ? '0' + i : i;
  s = s < 10 ? '0' + s : s;

  return format.replace(/[YmdHis]/g, key => {
    return {
      Y,
      m,
      d,
      H,
      i,
      s
    } [key];
  });
}

//二维数组去重
export const getUnique = array => {
  let obj = {}
  return array.filter((item, index) => {
    let newItem = item + JSON.stringify(item)
    return obj.hasOwnProperty(newItem) ? false : obj[newItem] = true
  })
}

/**
 * 对象转url参数
 * @param {*} data,对象
 * @param {*} isPrefix,是否自动加上"?"
 */
export const queryParams = (data = {}, isPrefix = true, arrayFormat = 'brackets') => {
	const prefix = isPrefix ? '?' : ''
	const _result = []
	if (['indices', 'brackets', 'repeat', 'comma'].indexOf(arrayFormat) == -1) arrayFormat = 'brackets'
	for (const key in data) {
		const value = data[key]
		// 去掉为空的参数
		if (['', undefined, null].indexOf(value) >= 0) {
			continue
		}
		// 如果值为数组，另行处理
		if (value.constructor === Array) {
			// e.g. {ids: [1, 2, 3]}
			switch (arrayFormat) {
				case 'indices':
					// 结果: ids[0]=1&ids[1]=2&ids[2]=3
					for (let i = 0; i < value.length; i++) {
						_result.push(key + '[' + i + ']=' + value[i])
					}
					break
				case 'brackets':
					// 结果: ids[]=1&ids[]=2&ids[]=3
					value.forEach(_value => {
						_result.push(key + '[]=' + _value)
					})
					break
				case 'repeat':
					// 结果: ids=1&ids=2&ids=3
					value.forEach(_value => {
						_result.push(key + '=' + _value)
					})
					break
				case 'comma':
					// 结果: ids=1,2,3
					let commaStr = ''
					value.forEach(_value => {
						commaStr += (commaStr ? ',' : '') + _value
					})
					_result.push(key + '=' + commaStr)
					break
				default:
					value.forEach(_value => {
						_result.push(key + '[]=' + _value)
					})
			}
		} else {
			_result.push(key + '=' + value)
		}
	}
	return _result.length ? prefix + _result.join('&') : ''
}

// 判断类型集合
export const checkStr = (str, type) => {
  switch (type) {
    case 'mobile': //手机号码
      return /^1[3|4|5|6|7|8|9][0-9]{9}$/.test(str);
    case 'tel': //座机
      return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
    case 'card': //身份证
      return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str);
    case 'mobileCode': //6位数字验证码
      return /^[0-9]{6}$/.test(str)
    case 'pwd': // 密码，长度在8~18之间，只能包含字母、数字、下划线和*，至少包含两种
    	return /^(?!^[\d]+$)(?!^[*]+$)(?!^[_]+$)(?!^[a-zA-Z]+$)[\w*]{8,18}$/.test(str)
    case 'payPwd': //支付密码 6位纯数字
      return /^[0-9]{6}$/.test(str)
    case 'postal': //邮政编码
      return /[1-9]\d{5}(?!\d)/.test(str);
    case 'QQ': //QQ号
      return /^[1-9][0-9]{4,9}$/.test(str);
    case 'email': //邮箱
      return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
    case 'money': //金额(小数点2位)
      return /(^[1-9]\d*(?:\.\d{0,2})?$)|(^[0](\.\d{0,2})?$)/.test(str);
    case 'URL': //网址
      return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(str)
    case 'IP': //IP
      return /((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))/.test(str);
    case 'date': //日期时间
      return /^(\d{4})\-(\d{2})\-(\d{2}) (\d{2})(?:\:\d{2}|:(\d{2}):(\d{2}))$/.test(str) ||
        /^(\d{4})\-(\d{2})\-(\d{2})$/
        .test(str)
    case 'number': //数字
      return /^[0-9]$/.test(str);
    case 'english': //英文
      return /^[a-zA-Z]+$/.test(str);
    case 'chinese': //中文
      return /^[\\u4E00-\\u9FA5]+$/.test(str);
    case 'lower': //小写
      return /^[a-z]+$/.test(str);
    case 'upper': //大写
      return /^[A-Z]+$/.test(str);
    case 'HTML': //HTML标记
      return /<("[^"]*"|'[^']*'|[^'">])*>/.test(str);
    default:
      return true;
  }
}