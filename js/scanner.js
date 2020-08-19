let Scanner = function () {

    let Token = function (type, value) {
        this.type = type;
        this.value = value;
    };

    let isNumber = function (char) {
        if (char >= '0' && char <= '9') {
            return true;
        }
        return false;
    };

    let isLetter = function (char) {
        if (char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z') {
            return true;
        }
        return false;
    };

    let isOperator = function (char) {
        if (char == '+' || char == '-' || char == '*' ||
            char == '/' || char == '%' || char == '^') {
            return true;
        }
        return false;
    };

    return {

        tokenize: function (char) {

            let result, numberBuffer, letterBuffer, charArray;

            charArray = char.replace(/\s+/g, "").split('');

            // Tokens container
            result = [];

            // Numbers container
            numberBuffer = [];

            // letters container
            letterBuffer = [];

            charArray.forEach((element, i) => {

                if (isNumber(element)) {

                    numberBuffer.push(element);

                } else if (isLetter(element)) {

                    let temp = '';
                    if (isNumber(charArray[i - 1])) {
                        temp = numberBuffer.join('');
                        numberBuffer = [];
                    }
                    letterBuffer.push(temp + element);

                } else if (isOperator(element)) {

                    if (isNumber(charArray[i - 1])) {
                        result.push(new Token("Angka", numberBuffer.join('')));
                        numberBuffer = [];
                    }

                    if (isLetter(charArray[i - 1])) {
                        result.push(new Token("Variabel", letterBuffer.join('')));
                        letterBuffer = [];
                    }

                    result.push(new Token("Operator", element));

                }

            });

            if (numberBuffer.length > 0) {
                result.push(new Token("Angka", numberBuffer.join('')));
                numberBuffer = [];
            }
            if (letterBuffer.length > 0) {
                result.push(new Token("Variabel", letterBuffer.join('')));
                letterBuffer = [];
            }

            return result;
        }

    }

}();