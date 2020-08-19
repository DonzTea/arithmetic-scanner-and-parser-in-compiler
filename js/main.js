let Main = function () {

    let selector = UI.getSelector();

    return {

        convertOperator: function (opr) {
            switch (opr) {
                case '^':
                    return 'pangkat';
                case '*':
                    return 'dikali';
                case '/':
                    return 'dibagi';
                case '%':
                    return 'modulus';
                case '+':
                    return 'ditambah';
                case '-':
                    return 'dikurangi';
                default:
                    return opr;
            }
        },

        getTokens: function () {
            return Scanner.tokenize(document.querySelector(selector.input).value);
        },

        init: function () {

            UI.listener();

        }

    }

}();

Main.init();