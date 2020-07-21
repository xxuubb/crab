jQuery.validator.addMethod("strongpwd", function(value, element) {
	var bool,numbool = 0,wodbool = 0,chrbool = 0;
	var allnot = /[^\x21-\x7e]/,hasnum = /\d/,haswod = /[a-zA-Z]/,haschr = /(?=[\x21-\x7e]+)[^A-Za-z0-9]/;
	if (allnot.test(value)) {
		return false;
	} else {
		if (hasnum.test(value)) numbool = 1;
		if (haswod.test(value)) wodbool = 1;
		if (haschr.test(value)) chrbool = 1;
		bool = (numbool + wodbool + chrbool) > 1 ?true:false;
		return bool;
	}
}, "密码必须8-20位，并且由字符、数字和符号两种以上组合");